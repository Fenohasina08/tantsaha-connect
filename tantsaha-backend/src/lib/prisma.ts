import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Fonction pour fermer la connexion Prisma (utile pour les tests)
export const disconnect = async () => {
  await prisma.$disconnect();
};

export default prisma;
