 // src/hooks/useWeather.ts
import { useState, useEffect, useCallback } from 'react';
import weatherService, { WeatherResponse, CurrentWeather, ForecastDay } from '../services/weatherService';

// AJOUT du paramètre 'days' avec valeur par défaut
export const useWeather = (initialCity: string = 'Antananarivo', days: number = 3) => {
  const [city, setCity] = useState<string>(initialCity);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // UTILISATION du paramètre 'days'
      const data = await weatherService.getWeatherData(city, days);
      setWeatherData(data);
      
      // Cache pour utilisation hors ligne
      localStorage.setItem(`weather_cache_${city}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      
    } catch (err: any) {
      console.error('Erreur lors du chargement de la météo:', err);
      
      // Essayer de récupérer du cache
      const cached = localStorage.getItem(`weather_cache_${city}`);
      if (cached) {
        const { data } = JSON.parse(cached);
        setWeatherData(data);
        setError('Données en cache - Vérifiez votre connexion Internet');
      } else {
        setError('Tsy nahomby ny fampakarana ny toetrandro. Hamarino ny fifandraisana Internet.');
      }
    } finally {
      setLoading(false);
    }
  }, [city, days]); // AJOUT de 'days' dans les dépendances

  // Chargement initial
  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  // Rafraîchissement automatique toutes les 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && navigator.onLine) {
        fetchWeatherData();
      }
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(interval);
  }, [fetchWeatherData, loading]);

  return {
    weatherData,
    currentWeather: weatherData?.current || null,
    dailyForecast: weatherData?.forecast?.forecastday || [],
    location: weatherData?.location || null,
    loading,
    error,
    city,
    setCity,
    refresh: fetchWeatherData,
  };
};