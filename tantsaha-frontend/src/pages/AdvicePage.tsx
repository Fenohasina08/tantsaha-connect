 import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Download, Headphones, Menu, Mic, Home, Book, Cloud } from 'lucide-react';

// ==================== TYPES ET INTERFACES ====================
type Theme = 'Katsaka' | 'Vary' | 'Voanjo';

interface AudioConseil {
  id: string;
  titre: string;
  dureeSec: number;
  fichier: string;
}

// ==================== DONNÉES ====================
const audioParTheme: Record<Theme, AudioConseil[]> = {
  'Katsaka': [
    { id: 'k1', titre: 'Fomba fisehoan-tsahan\'ny katsaka', dureeSec: 135, fichier: 'katsaka_semence.mp3' },
    { id: 'k2', titre: 'Fomba fitsaboana ny katsaka', dureeSec: 187, fichier: 'katsaka_traitement.mp3' }
  ],
  'Vary': [
    { id: 'v1', titre: 'Fomba fametrahana vary', dureeSec: 155, fichier: 'riz_semis.mp3' },
    { id: 'v2', titre: 'Fikarakarana ny rano', dureeSec: 210, fichier: 'riz_irrigation.mp3' }
  ],
  'Voanjo': [
    { id: 'vo1', titre: 'Fotoana tsara hamafy voanjo', dureeSec: 120, fichier: 'arachide_saison.mp3' }
  ]
};

// ==================== COMPOSANT PRINCIPAL ====================
export default function LecteurAudioPage() {
  // ==================== ÉTATS ====================
  const [themeActif, setThemeActif] = useState<Theme>('Katsaka');
  const [listeAudio, setListeAudio] = useState<AudioConseil[]>(audioParTheme['Katsaka']);
  const [indexAudioActif, setIndexAudioActif] = useState<number>(0);
  const [enLecture, setEnLecture] = useState<boolean>(false);
  const [progression, setProgression] = useState<number>(0);
  const [volume, setVolume] = useState<number>(80);
  
  // ==================== VARIABLES CALCULÉES ====================
  const audioActif = listeAudio[indexAudioActif];
  const dureeTotale = audioActif?.dureeSec || 0;
  const progressionActuelle = dureeTotale > 0 ? (progression / dureeTotale) * 100 : 0;
  
  // ==================== FONCTIONS ====================
  const simulerLecture = () => {
    if (!enLecture && dureeTotale > 0) {
      setEnLecture(true);
      // Simulation d'avancement
      const interval = setInterval(() => {
        setProgression(prev => {
          if (prev >= dureeTotale) {
            clearInterval(interval);
            setEnLecture(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setEnLecture(false);
    }
  };
  
  const changerTheme = (theme: Theme) => {
    setThemeActif(theme);
    setListeAudio(audioParTheme[theme]);
    setIndexAudioActif(0);
    setProgression(0);
    setEnLecture(false);
  };
  
  const audioSuivant = () => {
    if (indexAudioActif < listeAudio.length - 1) {
      setIndexAudioActif(indexAudioActif + 1);
      setProgression(0);
      setEnLecture(false);
    }
  };
  
  const audioPrecedent = () => {
    if (indexAudioActif > 0) {
      setIndexAudioActif(indexAudioActif - 1);
      setProgression(0);
      setEnLecture(false);
    }
  };
  
  const formaterTemps = (secondes: number): string => {
    if (secondes <= 0) return '0:00';
    const min = Math.floor(secondes / 60);
    const sec = Math.floor(secondes % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const themesDisponibles = Object.keys(audioParTheme) as Theme[];

  // ==================== RENDU ====================
  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-green-50 to-blue-50">
      {/* En-tête avec navigation et aide vocale */}
      <header className="sticky top-0 z-10 p-4 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <button className="p-2 transition-colors bg-gray-100 rounded-full hover:bg-gray-200">
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Enregistré</span>
            </div>
            <button className="p-2 transition-colors bg-purple-100 rounded-full hover:bg-purple-200">
              <Mic className="w-5 h-5 text-purple-700" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl p-4 mx-auto">
        {/* Titre principal */}
        <div className="mb-8 text-center">
          <h1 className="flex items-center justify-center gap-3 text-3xl font-bold text-gray-900">
            <Headphones className="w-8 h-8" />
            Torolalana Audio
          </h1>
          <p className="mt-2 text-gray-600">Mihaino torolalana momba ny fambolena</p>
        </div>

        {/* Lecteur principal - Cœur de l'interface */}
        <div className="p-6 mb-8 bg-white shadow-xl rounded-3xl">
          {/* Indicateur de thème */}
          <div className="flex justify-center mb-6">
            <span className="px-4 py-2 text-sm font-medium text-green-800 bg-green-100 rounded-full">
              {themeActif}
            </span>
          </div>
          
          {/* Titre de l'audio en cours */}
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-xl font-bold text-gray-900 line-clamp-2">
              {audioActif?.titre || 'Tsy misy audio'}
            </h2>
            <div className="text-gray-500">
              {indexAudioActif + 1} / {listeAudio.length}
            </div>
          </div>
          
          {/* Contrôles principaux */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <button 
              onClick={audioPrecedent}
              className={`p-3 rounded-full transition-colors ${indexAudioActif === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              disabled={indexAudioActif === 0}
            >
              <SkipBack className="w-6 h-6" />
            </button>
            
            <button 
              onClick={simulerLecture}
              className="flex items-center justify-center w-20 h-20 text-white transition-all bg-green-600 rounded-full shadow-lg hover:bg-green-700 hover:scale-105"
              disabled={!audioActif}
            >
              {enLecture ? (
                <Pause className="w-10 h-10" />
              ) : (
                <Play className="w-10 h-10 ml-1" />
              )}
            </button>
            
            <button 
              onClick={audioSuivant}
              className={`p-3 rounded-full transition-colors ${indexAudioActif === listeAudio.length - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              disabled={indexAudioActif === listeAudio.length - 1}
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
          
          {/* Barre de progression */}
          <div className="mb-8">
            <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
              <div 
                className="h-full transition-all duration-300 bg-green-500 rounded-full"
                style={{ width: `${progressionActuelle}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>{formaterTemps(progression)}</span>
              <span>{formaterTemps(dureeTotale)}</span>
            </div>
          </div>
          
          {/* Contrôle du volume */}
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-gray-500" />
            <div className="flex-1 h-2 overflow-hidden bg-gray-200 rounded-full">
              <div 
                className="h-full transition-all bg-blue-500 rounded-full"
                style={{ width: `${volume}%` }}
              ></div>
            </div>
            <span className="w-10 text-sm text-gray-600">{volume}%</span>
          </div>
          
          {/* Bouton de téléchargement */}
          <div className="flex justify-center mt-8">
            <button 
              className="flex items-center gap-2 px-5 py-3 text-blue-800 transition-colors bg-blue-100 hover:bg-blue-200 rounded-xl"
              disabled={!audioActif}
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Raisina ho an-dàlamo</span>
            </button>
          </div>
        </div>

        {/* Filtres par thème */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">Safidio ny vokatra</h3>
          <div className="flex flex-wrap gap-3">
            {themesDisponibles.map((theme) => (
              <button
                key={theme}
                onClick={() => changerTheme(theme)}
                className={`px-5 py-3 rounded-xl font-medium transition-all ${
                  themeActif === theme 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Liste des audios du thème actif */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-800">Torolalana ao anatin'ny {themeActif}</h3>
          <div className="space-y-3">
            {listeAudio.map((audio, index) => (
              <div
                key={audio.id}
                onClick={() => {
                  if (index !== indexAudioActif) {
                    setIndexAudioActif(index);
                    setProgression(0);
                    setEnLecture(false);
                  }
                }}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  index === indexAudioActif
                    ? 'bg-green-50 border-2 border-green-200'
                    : 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === indexAudioActif ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Headphones className={`w-5 h-5 ${
                        index === indexAudioActif ? 'text-green-600' : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{audio.titre}</div>
                      <div className="text-sm text-gray-500">{formaterTemps(audio.dureeSec)}</div>
                    </div>
                  </div>
                  {index === indexAudioActif && enLecture && (
                    <div className="flex gap-1 ml-2">
                      <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="w-1 h-6 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Navigation inférieure */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around max-w-3xl p-3 mx-auto">
          <button className="flex flex-col items-center p-2 text-gray-600 transition-colors hover:text-green-600">
            <Home className="w-6 h-6" />
            <span className="mt-1 text-xs">Trano</span>
          </button>
          <button className="flex flex-col items-center p-2 text-green-600">
            <Headphones className="w-6 h-6" />
            <span className="mt-1 text-xs font-medium">Torolalana</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-600 transition-colors hover:text-green-600">
            <Book className="w-6 h-6" />
            <span className="mt-1 text-xs">Boky</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-600 transition-colors hover:text-green-600">
            <Cloud className="w-6 h-6" />
            <span className="mt-1 text-xs">Toetoetra</span>
          </button>
        </div>
      </nav>
    </div>
  );
}