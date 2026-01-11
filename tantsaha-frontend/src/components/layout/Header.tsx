 import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaCloudSun, 
  FaBell, 
  FaBook, 
  FaVolumeUp,
  FaWifi,
  FaVolumeMute,
  FaCloud,
  FaSeedling
} from 'react-icons/fa';
import { useState, useEffect, useMemo, useCallback } from 'react';

export default function Header() {
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasNewAlerts, setHasNewAlerts] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null);

  // Gestion réseau améliorée
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnlineTime(new Date());
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Navigation mémoïsée pour la performance
  const navItems = useMemo(() => [
    { 
      to: '/', 
      icon: <FaHome className="text-xl" />, 
      label: 'Trano',
      description: 'Pejy fandraisana'
    },
    { 
      to: '/app/weather', 
      icon: <FaCloudSun className="text-xl" />, 
      label: 'Toetrandro',
      description: 'Toetrandro ankehitriny sy vinavinaina'
    },
    { 
      to: '/app/alerts', 
      icon: <FaBell className="text-xl" />, 
      label: 'Fampandrenesana',
      description: 'Fampandrenesana momba ny toetrandro'
    },
    { 
      to: '/app/journal', 
      icon: <FaBook className="text-xl" />, 
      label: 'Boky',
      description: 'Boky fitehirizana ny asa fambolena'
    },
    { 
      to: '/app/advice', 
      icon: <FaSeedling className="text-xl" />, 
      label: 'Torolalana',
      description: 'Torolalana momba ny fambolena'
    },
  ], []);

  // Fonction optimisée avec useCallback
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newState = !prev;
      console.log('Audio muted:', newState);
      return newState;
    });
  }, []);

  // Déterminer l'élément actif
  const activeIndex = useMemo(() => {
    return navItems.findIndex(item => location.pathname === item.to);
  }, [location.pathname, navItems]);

  return (
    <header className="sticky top-0 z-50 p-4 text-white shadow-xl bg-gradient-to-r from-green-700 to-emerald-700 backdrop-blur-sm bg-opacity-95">
      {/* En-tête supérieur */}
      <div className="flex items-center justify-between mb-4">
        {/* Indicateur de connexion amélioré */}
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-600'} transition-all`}>
            {isOnline ? (
              <FaWifi 
                className="text-white" 
                title="Misy Internet - Mandeha amin'ny angona vaovao" 
              />
            ) : (
              <FaCloud 
                className="text-white" 
                title="Tsy misy Internet - Mandeha amin'ny angona efa nangonina" 
              />
            )}
          </div>
          <div className="flex flex-col">
            <span className={`text-xs font-medium ${isOnline ? 'text-emerald-200' : 'text-amber-200'}`}>
              {isOnline ? 'Misy Internet' : 'Tsy misy Internet'}
            </span>
            {!isOnline && lastOnlineTime && (
              <span className="text-[10px] text-gray-300">
                Nangonina tamin'ny {lastOnlineTime.toLocaleTimeString('mg-MG')}
              </span>
            )}
          </div>
        </div>

        {/* Titre de l'application avec animation subtile */}
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-wide animate-pulse-slow">
            <span className="inline-block mr-2 animate-bounce-slow">🌾</span>
            Tantsaha <span className="text-emerald-300">Mifandray</span>
          </h1>
          <p className="text-xs text-emerald-200 mt-0.5">Torolalana ho an'ny tantsaha</p>
        </div>

        {/* Contrôle audio avec état clair */}
        <div className="flex items-center">
          <button 
            onClick={toggleMute}
            className={`
              p-2 rounded-full transition-all duration-300 
              ${isMuted 
                ? 'bg-gray-600 hover:bg-gray-500' 
                : 'bg-emerald-500 hover:bg-emerald-400'
              }
              focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-green-700
            `}
            aria-label={isMuted ? "Mampandeha ny feo" : "Ahena ny feo"}
            title={isMuted ? "Mampandeha ny feo" : "Ahena ny feo"}
          >
            {isMuted ? (
              <FaVolumeMute className="text-lg" />
            ) : (
              <FaVolumeUp className="text-lg" />
            )}
          </button>
          {isMuted && (
            <div className="px-2 py-1 ml-2 text-xs bg-gray-700 rounded-full">
              Feo tsy mandeha
            </div>
          )}
        </div>
      </div>

      {/* Navigation principale avec indicateur animé */}
      <nav className="relative">
        <div className="flex justify-around">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.to;
            const isAlertItem = item.to === '/alerts';
            
            return (
              <div key={item.to} className="relative">
                <Link 
                  to={item.to}
                  className={`
                    flex flex-col items-center p-3 rounded-xl transition-all duration-300
                    relative group
                    ${isActive 
                      ? 'bg-white/10 transform scale-110 shadow-lg' 
                      : 'hover:bg-white/5 hover:scale-105'
                    }
                    focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-700
                  `}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Icône principale avec effet de brillance */}
                  <div className="relative">
                    <span className={`
                      relative z-10 transition-colors duration-300
                      ${isActive ? 'text-white' : 'text-emerald-200 group-hover:text-white'}
                    `}>
                      {item.icon}
                    </span>
                    
                    {/* Effet de halo pour l'élément actif */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-white/20 animate-ping-slow"></div>
                    )}
                  </div>

                  {/* Badge notifications animé */}
                  {isAlertItem && hasNewAlerts && (
                    <>
                      <div className="absolute w-2 h-2 bg-red-400 rounded-full -top-1 -right-1 animate-ping"></div>
                      <div className="absolute w-3 h-3 bg-red-500 rounded-full -top-1 -right-1"></div>
                      <div className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-red-600 rounded-full text-[10px] font-bold animate-pulse">
                        !
                      </div>
                    </>
                  )}

                  {/* Effet de surbrillance au survol */}
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-b from-white/10 to-transparent rounded-xl group-hover:opacity-100"></div>
                </Link>

                {/* Tooltip amélioré */}
                <div className="absolute px-3 py-2 mb-2 text-sm text-white transition-all duration-200 transform -translate-x-1/2 rounded-lg shadow-xl opacity-0 pointer-events-none bg-gray-900/95 backdrop-blur-sm bottom-full left-1/2 group-hover:opacity-100 group-hover:-translate-y-1 whitespace-nowrap">
                  <div className="font-medium">{item.label}</div>
                  <div className="mt-1 text-xs text-gray-300">{item.description}</div>
                  <div className="absolute w-2 h-2 transform rotate-45 -translate-x-1/2 bg-gray-900/95 -bottom-1 left-1/2"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Indicateur d'élément actif animé (sous la navigation) */}
        {activeIndex >= 0 && (
          <div 
            className="absolute bottom-0 h-1 transition-all duration-500 ease-out bg-white rounded-full"
            style={{
              width: `${100 / navItems.length}%`,
              left: `${(activeIndex * 100) / navItems.length}%`,
              transform: 'translateY(8px)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
          </div>
        )}
      </nav>
    </header>
  );
}