 import React, { useState } from 'react';
import { 
  Book, 
  Calendar, 
  Filter, 
  Mic, 
  Plus, 
  TrendingUp,
  Droplets,
  Bug,
  CloudSun,
  CheckCircle,
  Leaf,
  Smile,
  Frown,
  Meh,
  AlertCircle
} from 'lucide-react';

// Types pour TypeScript
interface Parcelle {
  id: number;
  name: string;
  color: string;
  icon: string;
  sante: 'bonne' | 'probleme' | 'moyenne';
  age: string;
  ageIcons: string;
  alert: boolean;
}

interface Pictogramme {
  id: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}

interface Etat {
  id: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}

interface Rendement {
  value: number;
  icon: string;
  label: string;
}

// Données d'exemple
const initialParcelles: Parcelle[] = [
  { 
    id: 1, 
    name: 'Rizière Nord', 
    color: 'bg-green-500',
    icon: '🌾',
    sante: 'bonne',
    age: '60 jours',
    ageIcons: '🌱🌿',
    alert: false
  },
  { 
    id: 2, 
    name: 'Champ Maïs Est', 
    color: 'bg-orange-500',
    icon: '🌽',
    sante: 'probleme',
    age: '30 jours',
    ageIcons: '🌱🌿',
    alert: true
  },
  { 
    id: 3, 
    name: 'Jardin Légumes', 
    color: 'bg-blue-500',
    icon: '🥬',
    sante: 'moyenne',
    age: '15 jours',
    ageIcons: '🌱',
    alert: false
  },
];

const timelineData = [
  {
    date: 'Omaly (Il y a 30j)',
    type: 'semis',
    icon: '🌱',
    title: 'Semis',
    description: 'Début de la culture du maïs hybride'
  },
  {
    date: 'Anio (Aujourd\'hui)',
    type: 'traitement',
    icon: '🐛+💊',
    title: 'Observation & Traitement',
    description: 'Attaque de chenilles, traitement biologique appliqué',
    hasAudio: true
  },
  {
    date: 'Taona lasa (Saison passée)',
    type: 'recolte',
    icon: '✅',
    title: 'Récolte',
    description: 'Bon rendement: 3 sacs pleins par rangée',
    rendement: 3
  }
];

export default function JournalPage() {
  // Correction: Définir explicitement les types des états
  const [parcelles, setParcelles] = useState<Parcelle[]>(initialParcelles);
  const [selectedParcelle, setSelectedParcelle] = useState<number | null>(null);
  const [observationType, setObservationType] = useState<string | null>(null);
  const [observationState, setObservationState] = useState<string | null>(null);
  const [rendement, setRendement] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // Correction: Typage explicite des tableaux
  const pictogrammes: Pictogramme[] = [
    { id: 'plante', icon: <Leaf className="w-8 h-8" />, label: 'Zavamaniry', color: 'hover:bg-green-50' },
    { id: 'eau', icon: <Droplets className="w-8 h-8" />, label: 'Rano/Tôvana', color: 'hover:bg-blue-50' },
    { id: 'insecte', icon: <Bug className="w-8 h-8" />, label: 'Bibikely', color: 'hover:bg-red-50' },
    { id: 'recolte', icon: <CheckCircle className="w-8 h-8" />, label: 'Fijinjana', color: 'hover:bg-yellow-50' },
    { id: 'meteo', icon: <CloudSun className="w-8 h-8" />, label: 'Toetoetra', color: 'hover:bg-gray-50' },
    { id: 'note', icon: <Book className="w-8 h-8" />, label: 'Fanamarihana', color: 'hover:bg-purple-50' },
  ];

  const etats: Etat[] = [
    { id: 'triste', icon: <Frown className="w-10 h-10" />, label: 'Ratsy', color: 'bg-red-100' },
    { id: 'neutre', icon: <Meh className="w-10 h-10" />, label: 'Antony', color: 'bg-yellow-100' },
    { id: 'content', icon: <Smile className="w-10 h-10" />, label: 'Tsara', color: 'bg-green-100' },
  ];

  const rendements: Rendement[] = [
    { value: 1, icon: '👜', label: 'Kely' },
    { value: 2, icon: '👜👜', label: 'Antony' },
    { value: 3, icon: '👜👜👜', label: 'Be' },
  ];

  const handleAddObservation = () => {
    // Logique pour ajouter l'observation
    alert('Observation enregistrée !');
    // Réinitialiser
    setObservationType(null);
    setObservationState(null);
    setRendement(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* En-tête avec aide vocale et mode hors-ligne */}
      <div className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button className="p-2 bg-purple-100 rounded-full">
              <Mic className="w-5 h-5 text-purple-700" />
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Enregistré localement</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Filter className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Calendar className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl p-4 mx-auto">
        {/* Titre et statistiques */}
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-purple-800">
            <Book className="w-8 h-8" />
            BOKY FAMBOLENA
          </h1>
          <p className="mt-1 text-gray-600">Suivi visuel de vos cultures</p>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-white border shadow-sm rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Parcelles actives</span>
                <div className="text-2xl font-bold text-green-700">3</div>
              </div>
              <div className="mt-2 text-sm text-gray-500">🌾🌽🥬</div>
            </div>
            
            <div className="p-4 bg-white border shadow-sm rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Alertes</span>
                <div className="flex items-center gap-1 text-2xl font-bold text-orange-700">
                  <AlertCircle className="w-5 h-5" />
                  1
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">Problème insectes</div>
            </div>
          </div>
        </div>

        {/* Vue des parcelles */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Ny Sahako (Mes parcelles)
          </h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {parcelles.map((parcelle) => (
              <div 
                key={parcelle.id}
                className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer hover:shadow-md transition-shadow ${
                  selectedParcelle === parcelle.id ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => setSelectedParcelle(parcelle.id)}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-8 h-8 rounded-full ${parcelle.color}`}></div>
                  {parcelle.alert && (
                    <div className="text-red-500">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <div className="mb-2 text-2xl">{parcelle.icon}</div>
                  <h3 className="font-semibold text-gray-800">{parcelle.name}</h3>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      {parcelle.sante === 'bonne' && <Smile className="w-5 h-5 text-green-500" />}
                      {parcelle.sante === 'probleme' && <Frown className="w-5 h-5 text-red-500" />}
                      {parcelle.sante === 'moyenne' && <Meh className="w-5 h-5 text-yellow-500" />}
                      <span className="text-sm capitalize">{parcelle.sante}</span>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>{parcelle.ageIcons}</span>
                        <span>{parcelle.age}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline pour la parcelle sélectionnée */}
        {selectedParcelle && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Tantaran'ny zavamaniry (Historique)
            </h2>
            
            <div className="p-6 bg-white border shadow-sm rounded-xl">
              <div className="space-y-6">
                {timelineData.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                        <span className="text-xl">{item.icon}</span>
                      </div>
                      {index < timelineData.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 pb-6">
                      <div className="mb-1 text-sm text-gray-500">{item.date}</div>
                      <div className="font-semibold text-gray-800">{item.title}</div>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                      
                      {item.hasAudio && (
                        <button className="flex items-center gap-2 mt-2 text-purple-600 hover:text-purple-700">
                          <Mic className="w-4 h-4" />
                          <span className="text-sm">Écouter la note vocale</span>
                        </button>
                      )}
                      
                      {item.rendement && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xl">{'👜'.repeat(item.rendement)}</span>
                          <span className="text-sm text-gray-600">Rendement estimé</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Formulaire d'ajout d'observation */}
        <div className="p-6 mb-8 bg-white border shadow-lg rounded-xl">
          <h2 className="mb-6 text-xl font-semibold text-gray-800">
            Hanampy Fandinihana (Ajouter une observation)
          </h2>
          
          {/* Étape 1: Choix du type */}
          <div className="mb-8">
            <h3 className="mb-4 font-medium text-gray-700">Inona no hitanao? (Qu'avez-vous observé?)</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {pictogrammes.map((picto) => (
                <button
                  key={picto.id}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${
                    observationType === picto.id 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${picto.color}`}
                  onClick={() => setObservationType(picto.id)}
                >
                  {picto.icon}
                  <span className="text-sm text-center">{picto.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Étape 2: Évaluation */}
          {observationType && observationType !== 'recolte' && (
            <div className="mb-8">
              <h3 className="mb-4 font-medium text-gray-700">Ahoana ny toetry? (Quel est l'état?)</h3>
              <div className="flex justify-center gap-6">
                {etats.map((etat) => (
                  <button
                    key={etat.id}
                    className={`p-4 rounded-xl flex flex-col items-center gap-3 transition-transform ${
                      observationState === etat.id ? 'scale-105 ring-2 ring-offset-2 ring-purple-500' : ''
                    } ${etat.color}`}
                    onClick={() => setObservationState(etat.id)}
                  >
                    {etat.icon}
                    <span className="text-sm">{etat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Étape 2bis: Rendement pour récolte */}
          {observationType === 'recolte' && (
            <div className="mb-8">
              <h3 className="mb-4 font-medium text-gray-700">Ohatrinona ny vokatra? (Quel rendement?)</h3>
              <div className="flex justify-center gap-6">
                {rendements.map((r) => (
                  <button
                    key={r.value}
                    className={`p-4 rounded-xl flex flex-col items-center gap-3 transition-transform ${
                      rendement === r.value ? 'scale-105 ring-2 ring-offset-2 ring-yellow-500 bg-yellow-50' : 'bg-gray-50'
                    }`}
                    onClick={() => setRendement(r.value)}
                  >
                    <span className="text-2xl">{r.icon}</span>
                    <span className="text-sm">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Enregistrement audio */}
          {(observationType && (observationState || rendement)) && (
            <div className="mb-8">
              <h3 className="mb-4 font-medium text-gray-700">Hanampy fanazavana? (Ajouter une explication?)</h3>
              <div className="flex flex-col items-center">
                <button
                  className={`p-6 rounded-full ${
                    isRecording ? 'bg-red-100 text-red-600' : 'bg-purple-100 text-purple-600'
                  } hover:opacity-90 transition-all`}
                  onClick={() => setIsRecording(!isRecording)}
                >
                  <Mic className={`w-8 h-8 ${isRecording ? 'animate-pulse' : ''}`} />
                </button>
                <p className="mt-3 text-sm text-gray-600">
                  {isRecording ? "Enregistrement en cours..." : "Tsindrio ny microphone"}
                </p>
              </div>
            </div>
          )}

          {/* Bouton de validation */}
          <div className="flex justify-center">
            <button
              className={`px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                observationType ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!observationType}
              onClick={handleAddObservation}
            >
              <Plus className="w-5 h-5" />
              Atao (Enregistrer)
            </button>
          </div>
        </div>

        {/* Bouton flottant d'ajout */}
        <button className="fixed flex items-center justify-center text-white transition-all bg-purple-600 rounded-full shadow-lg bottom-6 right-6 w-14 h-14 hover:bg-purple-700 hover:scale-110">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation inférieure */}
      <div className="sticky bottom-0 bg-white border-t">
        <div className="flex justify-around max-w-4xl p-4 mx-auto">
          <button className="flex flex-col items-center gap-1 text-purple-600">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
              <Book className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Boky</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-700">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs">Statistika</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-700">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
              <CloudSun className="w-5 h-5" />
            </div>
            <span className="text-xs">Toetoetra</span>
          </button>
        </div>
      </div>
    </div>
  );
}