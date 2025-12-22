import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const loginSchema = z.object({
  telephone: z.string()
    .regex(/^[0-9]+$/, 'Le numéro doit contenir uniquement des chiffres')
    .length(10, 'Le numéro doit faire exactement 10 chiffres')
    .refine((num) => ['032', '033', '034', '037', '038'].includes(num.substring(0, 3)), {
      message: 'Le numéro doit commencer par 032, 033, 034, 037 ou 038'
    })
});

export const login = async (req: Request, res: Response) => {
  try {
    const { telephone } = loginSchema.parse(req.body);
    const prefixe = telephone.substring(0, 3);
    
    console.log(`📞 Tentative de connexion avec: ${telephone}`);
    
    // Recherche utilisateur
    let user = await prisma.utilisateur.findUnique({
      where: { telephone },
      include: { parcours: { take: 100, orderBy: { date_action: 'desc' } } }
    });
    
    const isNewUser = !user;
    
    if (isNewUser) {
      // Création nouvel utilisateur
      user = await prisma.utilisateur.create({
        data: {
          telephone,
          prefixe,
          statut: 'actif',
          parcours: {
            create: [{
              type_action: 'inscription',
              donnees: { message: 'Bienvenue!', date: new Date().toISOString() }
            }]
          }
        },
        include: { parcours: true }
      });
      console.log(`✅ Nouvel utilisateur: ${user.telephone}`);
    } else {
      // Mise à jour connexion existante
      await prisma.utilisateur.update({
        where: { id: user.id },
        data: { derniere_connexion: new Date() }
      });
      
      await prisma.parcours.create({
        data: {
          utilisateur_id: user.id,
          type_action: 'connexion',
          donnees: { timestamp: new Date().toISOString() }
        }
      });
      
      // Recharger l'utilisateur avec tous les logs
      user = await prisma.utilisateur.findUnique({
        where: { id: user.id },
        include: { parcours: { take: 100, orderBy: { date_action: 'desc' } } }
      });
      
      console.log(`🔁 Utilisateur reconnecté: ${user!.telephone}`);
    }
    
    // À ce stade, user ne peut pas être null
    if (!user) {
      throw new Error('Utilisateur non défini');
    }
    
    // Générer token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        telephone: user.telephone, 
        isNewUser,
        prefixe: user.prefixe 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '365d' }
    );
    
    // Réponse
    res.status(200).json({
      success: true,
      message: isNewUser ? 'Inscription réussie!' : 'Connexion réussie!',
      data: {
        token,
        utilisateur: {
          id: user.id,
          telephone: user.telephone,
          prefixe: user.prefixe,
          date_inscription: user.date_inscription,
          isNewUser,
          historique: user.parcours.map(p => ({
            type: p.type_action,
            date: p.date_action,
            donnees: p.donnees
          }))
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: error.errors.map(err => ({
          champ: err.path.join('.'),
          message: err.message
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};
