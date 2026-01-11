 import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion'; // On utilise Framer Motion ici aussi !
import { 
  FaHome, FaCloudSun, FaBell, FaBook, 
  FaVolumeUp, FaWifi, FaVolumeMute, FaCloud, FaSeedling 
} from 'react-icons/fa';
import { useState, useEffect, useMemo, useCallback } from 'react';

// 1. Constantes sorties du composant pour la performance
const NAV_ITEMS = [
  { to: '/app', icon: FaHome, label: 'Trano', desc: 'Fandraisana' },
  { to: '/app/weather', icon: FaCloudSun, label: 'Toetrandro', desc: 'Vinavina' },
  { to: '/app/alerts', icon: FaBell, label: 'Hafatra', desc: 'Fampandrenesana', alert: true },
  { to: '/app/journal', icon: FaBook, label: 'Boky', desc: 'Asa fambolena' },
  { to: '/app/advice', icon: FaSeedling, label: 'Torohevitra', desc: 'Torolalana' },
];

export default function Header() {
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const toggleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', toggleStatus);
    window.addEventListener('offline', toggleStatus);
    return () => {
      window.removeEventListener('online', toggleStatus);
      window.removeEventListener('offline', toggleStatus);
    };
  }, []);

  const toggleMute = useCallback(() => setIsMuted(prev => !prev), []);

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3 text-white border-b shadow-2xl bg-emerald-800/90 backdrop-blur-md border-white/10">
      {/* Barre Supérieure */}
      <div className="flex items-center justify-between max-w-5xl mx-auto mb-4">
        
        {/* Status Réseau avec Pulse */}
        <div className="flex items-center gap-3 group">
          <div className={`relative p-2 rounded-xl transition-colors ${isOnline ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
             {isOnline ? <FaWifi className="text-emerald-400" /> : <FaCloud className="text-red-400" />}
             <span className={`absolute top-0 right-0 w-2 h-2 rounded-full animate-ping ${isOnline ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
          </div>
          <span className="hidden text-xs font-semibold tracking-wider uppercase md:block opacity-70">
            {isOnline ? 'Mifandray' : 'Tapaka'}
          </span>
        </div>

        {/* Logo Central */}
        <div className="flex flex-col items-center">
          <h1 className="flex items-center text-xl font-black tracking-tighter uppercase">
            <span className="text-emerald-400">Tantsaha</span>
            <span className="ml-1 text-white opacity-90">Mifandray</span>
          </h1>
        </div>

        {/* Mute Button */}
        <button 
          onClick={toggleMute}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 active:scale-95"
        >
          {isMuted ? <FaVolumeMute className="text-lg opacity-50" /> : <FaVolumeUp className="text-lg text-emerald-400" />}
        </button>
      </div>

      {/* Navigation avec Framer Motion */}
      <nav className="relative max-w-md mx-auto">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link 
                key={item.to} 
                to={item.to}
                className={`relative flex flex-col items-center p-2 rounded-2xl transition-all duration-300 ${isActive ? 'text-white' : 'text-white/50 hover:text-white'}`}
              >
                <item.icon className={`text-2xl mb-1 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                
                {/* Point de Notification */}
                {item.alert && (
                  <span className="absolute w-2 h-2 bg-orange-500 border-2 rounded-full top-2 right-3 border-emerald-800"></span>
                )}

                {/* Indicateur de page active animé */}
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute w-8 h-1 rounded-full -bottom-1 bg-emerald-400"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}