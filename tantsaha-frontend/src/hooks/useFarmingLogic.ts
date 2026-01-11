import { title } from 'process';
import { useMemo } from 'react';

interface CurrentWeather {
  temp_c: number;
  uv: number;
  precip_mm: number;
  wind_kph: number;
  // Ajoute ici les autres propriétés si besoin
}
// On exporte la fonction pour pouvoir l'utiliser ailleurs
export const useFarmingLogic = (currentWeather: CurrentWeather | null) => {
  
  // Ici, nous allons déplacer tes calculs complexes
   const alerts = useMemo(() => {
    if (!currentWeather) return [];
    
    const alertsList = [];

    // On teste la condition
    if (currentWeather.uv >= 8) {
      // Au lieu de retourner du HTML, on "pousse" un objet dans notre liste
      alertsList.push({
        type: 'high',
        title: 'Indrisy UV tafahoatra',
        message: 'Aza mivoaka eo amin\'ny masoandro eo anelanelan\'ny 10h sy 14h.',
        icon: '☀️',
        severity: 'high'
      });
    }
    if(currentWeather.precip_mm > 10)
    {
        alertsList.push({
            type: 'rain',
            title: 'Rotsak\'orana be miandry',
            message: 'Ho mafy ny rotsakorana',
            icon: '🌧️',
            severity: 'medium'
                        })
    }
    
    if (currentWeather.wind_kph >= 20) {
      // Au lieu de retourner du HTML, on "pousse" un objet dans notre liste
      alertsList.push({
        type: 'wind',
        title: 'Rivotra mahery',
        message: ' Mitandrema fa ho mafy ny tsiodrivotra.',
        icon: '💨',
        severity: 'high'
      });
    }
    return alertsList;
  }, [currentWeather]);
  return alerts;
};