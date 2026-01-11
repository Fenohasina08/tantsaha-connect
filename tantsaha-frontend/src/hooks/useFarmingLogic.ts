 import { useMemo } from 'react';

interface CurrentWeather {
  temp_c: number;
  uv: number;
  precip_mm: number;
  wind_kph: number;
  humidity: number;
}

// On exporte la fonction pour pouvoir l'utiliser ailleurs
export const useFarmingLogic = (currentWeather: CurrentWeather | null) => {

  const alerts = useMemo(() => {
    if (!currentWeather) return [];

    const alertsList = [];

    if (currentWeather.uv >= 8) {
      alertsList.push({
        type: 'high',
        title: 'Indrisy UV tafahoatra',
        message: "Aza mivoaka eo amin'ny masoandro eo anelanelan'ny 10h sy 14h.",
        icon: '☀️',
        severity: 'high',
      });
    }

    if (currentWeather.precip_mm > 10) {
      alertsList.push({
        type: 'rain',
        title: "Rotsak'orana be miandry",
        message: 'Ho mafy ny rotsakorana',
        icon: '🌧️',
        severity: 'medium',
      });
    }

    if (currentWeather.wind_kph >= 20) {
      alertsList.push({
        type: 'wind',
        title: 'Rivotra mahery',
        message: 'Mitandrema fa ho mafy ny tsiodrivotra.',
        icon: '💨',
        severity: 'high',
      });
    }

    return alertsList;
  }, [currentWeather]);

  const advice = useMemo(() => {
    if (!currentWeather) return [];

    const adviceList = [];

    if (currentWeather.temp_c >= 25 && currentWeather.temp_c <= 32) {
      adviceList.push({
        icon: '🌱',
        title: 'Famafazana voa',
        description: 'Andro tsara hamafazana voa.',
        timeframe: 'Androany',
        priority: 1,
      });
    }
    if (currentWeather.humidity < 40) {
      adviceList.push({
        icon: '💧',
        title: 'Fanondrahana',
        description: 'Maina ny andro, mila manondraka rano bebe kokoa.',
        timeframe: 'Androany',
        priority: 2
      });
    }
    return adviceList;
  }, [currentWeather]);

  return { alerts, advice };
};
