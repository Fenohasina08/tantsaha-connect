 import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Download, Book, Mic, Home, Cloud, ChevronLeft, User, Clock, Eye } from 'lucide-react';

// ==================== TYPES ====================
type DocumentTheme = 'Katsaka' | 'Vary' | 'Voanjo';

interface DocumentSection {
  id: string;
  titre: string;
  contenu: string[];
  dureeSec: number; // Durée estimée de lecture de la section
}

interface DocumentAudio {
  id: string;
  theme: DocumentTheme;
  titre: string;
  auteur: string;
  dureeTotale: number;
  date: string;
  sections: DocumentSection[];
}

// ==================== DONNÉES : DOCUMENT SUR LE MAÏS ====================
const documentMais: DocumentAudio = {
  id: 'doc1',
  theme: 'Katsaka',
  titre: 'Fambolena Katsaka eto Madagascar',
  auteur: 'Departemanta ny Fambolena',
  dureeTotale: 540, // 9 minutes
  date: 'Janvier 2024',
  sections: [
    {
      id: 'sec1',
      titre: 'Fisafidianana ny toerana sy ny tany',
      dureeSec: 60,
      contenu: [
        'Ny katsaka dia mila tany malalaka sy mahavokatra.',
        'Safidio toerana misy masoandro be (6 ora mahery isan\'andro).',
        'Ny tany tsara indrindra dia ny tany fasika marefo misy zezika.'
      ]
    },
    {
      id: 'sec2',
      titre: 'Fomba fambolena',
      dureeSec: 120,
      contenu: [
        'Fotoana tsara hamafy: Oktobra ka hatramin\'ny Desambra (faritanin\'ny tapany avaratra).',
        'Halalin\'ny lavaka: 3-5 cm. Apetraho ny voa roa isaky ny lavaka.',
        'Elanelana eo amin\'ny tsipika: 70-80 cm. Elanelana eo amin\'ny voa: 20-30 cm.'
      ]
    },
    {
      id: 'sec3',
      titre: 'Fikarakarana',
      dureeSec: 180,
      contenu: [
        'Fanadiovana: Atombohy 2 herinando any aorian\'ny famafy.',
        'Fitaniana: Atao rehefa miakatra 30-40 cm ny katsaka.',
        'Fanosorana: Esory ny ravina maty na voan\'aretina.',
        'Rano: Zarào rano indroa isam-bolana raha tsy misy orana.'
      ]
    },
    {
      id: 'sec4',
      titre: 'Fijinjana sy fitehirizana',
      dureeSec: 120,
      contenu: [
        'Jereo ny katsaka rehefa mivadika volontsôkôlà ny volony.',
        'Alehoy mandritra ny 2-3 andro alohan\'ny hanongotra.',
        'Ahenao ao anaty tranokely maina sy tsy misy hamandoana.'
      ]
    },
    {
      id: 'sec5',
      titre: 'Olatra sy aretina',
      dureeSec: 60,
      contenu: [
        'Bibikely: Valala sy ny kankana lavenona.',
        'Aretina: Ny aretin\'ny ravina sy ny vovoka volomparasy.',
        'Vahaolana voajanahary: Fampiasana savony maitso na ranon\'ahidrabibitika.'
      ]
    }
  ]
};

// ==================== COMPOSANT PRINCIPAL ====================
export default function DocumentAudioPage() {
  // ==================== ÉTATS ====================
  const [documentActif] = useState<DocumentAudio>(documentMais);
  const [sectionActive, setSectionActive] = useState<number>(0);
  const [ligneActive, setLigneActive] = useState<number>(0);
  const [enLecture, setEnLecture] = useState<boolean>(false);
  const [progressionSection, setProgressionSection] = useState<number>(0);
  const [vitesse, setVitesse] = useState<number>(1);
  const [afficherTexte, setAfficherTexte] = useState<boolean>(true);
  
  const sectionActuelle = documentActif.sections[sectionActive];
  const totalLignes = documentActif.sections.reduce((total, sec) => total + sec.contenu.length, 0);
  const lignesLues = documentActif.sections.slice(0, sectionActive).reduce((total, sec) => total + sec.contenu.length, 0) + ligneActive;
  const progressionTotale = totalLignes > 0 ? (lignesLues / totalLignes) * 100 : 0;
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // ==================== SIMULATION LECTURE ====================
  const demarrerLecture = () => {
    if (enLecture) {
      // Arrêter la lecture
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setEnLecture(false);
    } else {
      // Démarrer la lecture
      setEnLecture(true);
      
      intervalRef.current = setInterval(() => {
        setProgressionSection(prev => {
          const dureeLigne = sectionActuelle.dureeSec / sectionActuelle.contenu.length;
          const progressionParTick = (100 / dureeLigne) * vitesse;
          
          if (prev + progressionParTick >= 100) {
            // Passer à la ligne suivante
            if (ligneActive < sectionActuelle.contenu.length - 1) {
              setLigneActive(ligneActive + 1);
              return 0;
            } 
            // Passer à la section suivante
            else if (sectionActive < documentActif.sections.length - 1) {
              setSectionActive(sectionActive + 1);
              setLigneActive(0);
              return 0;
            } 
            // Fin du document
            else {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              setEnLecture(false);
              return 100;
            }
          }
          
          return prev + progressionParTick;
        });
      }, 1000 / vitesse);
    }
  };
  
  // Nettoyage de l'intervalle
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  const allerSection = (index: number) => {
    setSectionActive(index);
    setLigneActive(0);
    setProgressionSection(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setEnLecture(false);
  };
  
  const formaterTemps = (secondes: number): string => {
    const min = Math.floor(secondes / 60);
    const sec = Math.floor(secondes % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };
  
  const dureeRestante = documentActif.sections
    .slice(sectionActive)
    .reduce((total, sec, idx) => {
      if (idx === 0) {
        // Pour la section active, tenir compte de la progression
        const progressionRatio = progressionSection / 100;
        return total + (sec.dureeSec * (1 - progressionRatio));
      }
      return total + sec.dureeSec;
    }, 0);
  
  // ==================== RENDU ====================
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* En-tête */}
      <header className="sticky top-0 z-20 p-4 border-b bg-white/90 backdrop-blur-sm">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setAfficherTexte(!afficherTexte)}
              className="flex items-center gap-2 px-3 py-2 text-blue-800 bg-blue-100 rounded-lg hover:bg-blue-200"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">{afficherTexte ? 'Hanidy ny lahatsoratra' : 'Haseho ny lahatsoratra'}</span>
            </button>
            <button className="p-2 bg-purple-100 rounded-full hover:bg-purple-200">
              <Mic className="w-5 h-5 text-purple-700" />
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl p-4 mx-auto">
        {/* Informations du document */}
        <div className="p-6 mb-8 bg-white border shadow-sm rounded-2xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                  {documentActif.theme}
                </span>
                <span className="text-sm text-gray-500">• {documentActif.date}</span>
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">
                {documentActif.titre}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {documentActif.auteur}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formaterTemps(documentActif.dureeTotale)}
                </span>
              </div>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-3 font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl">
              <Download className="w-5 h-5" />
              <span>Raisina PDF</span>
            </button>
          </div>
          
          {/* Barre de progression globale */}
          <div className="mt-6">
            <div className="flex justify-between mb-1 text-sm text-gray-600">
              <span>Efa novakina: {Math.round(progressionTotale)}%</span>
              <span>Sisa: {formaterTemps(dureeRestante)}</span>
            </div>
            <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
              <div 
                className="h-full transition-all duration-300 bg-green-500 rounded-full"
                style={{ width: `${progressionTotale}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Panneau du document (à gauche) */}
          {afficherTexte && (
            <div className="lg:w-2/3">
              <div className="overflow-hidden bg-white border shadow-lg rounded-2xl">
                {/* Navigation des sections */}
                <div className="border-b">
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {documentActif.sections.map((section, index) => (
                      <button
                        key={section.id}
                        onClick={() => allerSection(index)}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                          sectionActive === index
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {section.titre}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Contenu de la section active */}
                <div className="p-6">
                  <h2 className="pb-3 mb-6 text-xl font-bold text-gray-900 border-b">
                    {sectionActuelle.titre}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({formaterTemps(sectionActuelle.dureeSec)})
                    </span>
                  </h2>
                  
                  <div className="space-y-6">
                    {sectionActuelle.contenu.map((ligne, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border transition-all ${
                          ligneActive === index
                            ? 'bg-green-50 border-green-200 shadow-sm'
                            : 'border-gray-100 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            ligneActive === index ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {index + 1}
                          </div>
                          <p className="pt-1 leading-relaxed text-gray-800">{ligne}</p>
                        </div>
                        
                        {/* Indicateur de lecture sur la ligne active */}
                        {ligneActive === index && enLecture && (
                          <div className="mt-4 pl-11">
                            <div className="flex items-center gap-2 text-green-600">
                              <div className="flex gap-1">
                                <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse"></div>
                                <div className="w-1 h-6 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                              </div>
                              <span className="text-sm">Mihaino ankehitriny...</span>
                            </div>
                            
                            {/* Barre de progression de la ligne */}
                            <div className="mt-2">
                              <div className="h-1 overflow-hidden bg-gray-200 rounded-full">
                                <div 
                                  className="h-full transition-all duration-300 bg-green-500 rounded-full"
                                  style={{ width: `${progressionSection}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Panneau du lecteur (à droite ou en bas) */}
          <div className={`${afficherTexte ? 'lg:w-1/3' : 'w-full max-w-2xl mx-auto'}`}>
            <div className="sticky p-6 bg-white border shadow-xl top-24 rounded-2xl">
              <h3 className="flex items-center gap-2 mb-6 text-lg font-bold text-gray-900">
                <Volume2 className="w-5 h-5" />
                Mpamaky Audio
              </h3>
              
              {/* Bouton de lecture principal */}
              <div className="flex justify-center mb-8">
                <button
                  onClick={demarrerLecture}
                  className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 ${
                    enLecture ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {enLecture ? (
                    <Pause className="w-12 h-12 text-white" />
                  ) : (
                    <Play className="w-12 h-12 ml-1 text-white" />
                  )}
                </button>
              </div>
              
              {/* Informations de lecture */}
              <div className="mb-8 space-y-4">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Mihaino ankehitriny</div>
                  <div className="mt-1 text-lg font-bold text-gray-900">{sectionActuelle.titre}</div>
                  <div className="mt-1 text-gray-600">
                    Andininy {ligneActive + 1} / {sectionActuelle.contenu.length}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex justify-between mb-1 text-sm text-gray-600">
                    <span>Ankapobeny</span>
                    <span>{Math.round(progressionTotale)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                    <div 
                      className="h-full transition-all bg-green-500 rounded-full"
                      style={{ width: `${progressionTotale}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Contrôles */}
              <div className="space-y-6">
                {/* Contrôle de vitesse */}
                <div>
                  <div className="flex justify-between mb-2 text-sm text-gray-700">
                    <span>Haingam-pandeha</span>
                    <span className="font-medium">{vitesse.toFixed(1)}×</span>
                  </div>
                  <div className="flex gap-2">
                    {[0.5, 1.0, 1.5, 2.0].map((v) => (
                      <button
                        key={v}
                        onClick={() => setVitesse(v)}
                        className={`flex-1 py-2 rounded-lg text-center ${
                          vitesse === v
                            ? 'bg-green-100 text-green-800 font-medium'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {v}×
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Navigation des sections */}
                <div>
                  <div className="mb-2 text-sm text-gray-700">Zara-tantara</div>
                  <div className="space-y-2">
                    {documentActif.sections.map((section, index) => (
                      <button
                        key={section.id}
                        onClick={() => allerSection(index)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg text-left ${
                          sectionActive === index
                            ? 'bg-green-50 border border-green-200'
                            : 'hover:bg-gray-50 border border-gray-100'
                        }`}
                      >
                        <span className={`font-medium ${
                          sectionActive === index ? 'text-green-800' : 'text-gray-700'
                        }`}>
                          {section.titre}
                        </span>
                        <span className="text-sm text-gray-500">{formaterTemps(section.dureeSec)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="pt-6 mt-8 border-t">
                <div className="flex items-center justify-between text-gray-600">
                  <span className="text-sm">Zavatra rehetra voatahiry eto amin'ny fitaovanao</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex justify-around max-w-6xl p-3 mx-auto">
          <button className="flex flex-col items-center p-2 text-gray-600 hover:text-green-600">
            <Home className="w-6 h-6" />
            <span className="mt-1 text-xs">Trano</span>
          </button>
          <button className="flex flex-col items-center p-2 text-green-600">
            <Book className="w-6 h-6" />
            <span className="mt-1 text-xs font-medium">Torolalana</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-600 hover:text-green-600">
            <Book className="w-6 h-6" />
            <span className="mt-1 text-xs">Boky</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-600 hover:text-green-600">
            <Cloud className="w-6 h-6" />
            <span className="mt-1 text-xs">Toetoetra</span>
          </button>
        </div>
      </nav>
    </div>
  );
}