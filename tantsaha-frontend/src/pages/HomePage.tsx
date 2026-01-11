 // =======================
// IMPORTS
// =======================
import React, { useMemo } from 'react';
import { useWeather } from '../hooks/useWeather';
import { useFarmingLogic } from '../hooks/useFarmingLogic';

import {
  FaWind,
  FaTint,
  FaCloudRain,
  FaSun,
  FaMoon,
  FaThermometerHalf,
  FaCompressAlt,
  FaSolarPanel,
  FaLeaf,
  FaSeedling,
  FaWater,
  FaBug
} from 'react-icons/fa';

import { WiBarometer, WiHumidity, WiRaindrop } from 'react-icons/wi';

// =======================
// CONSTANTES
// =======================
const CONFIG = {
  LOCATION: 'Antananarivo',
  FORECAST_DAYS: 3,
  WIND_STRONG_THRESHOLD: 20,
  RAIN_HEAVY_THRESHOLD: 10,
  UV_HIGH_THRESHOLD: 8,
  TEMP_HOT_THRESHOLD: 30
} as const;

// =======================
// TYPES & INTERFACES
// =======================
interface CurrentWeather {
  temp_c: number;
  feelslike_c: number;
  condition: {
    text: string;
    icon: string;
  };
  wind_kph: number;
  wind_degree?: number;
  wind_dir?: string;
  humidity: number;
  precip_mm: number;
  pressure_mb: number;
  uv: number;
  gust_kph?: number;
}

interface ForecastDay {
  date: string;
  day: {
    avgtemp_c: number;
    maxtemp_c: number;
    mintemp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    daily_chance_of_rain: number;
    maxwind_kph: number;
    avghumidity: number;
  };
  astro?: {
    sunrise: string;
    sunset: string;
  };
}

interface Location {
  name: string;
  region: string;
}

// =======================
// UTILS (FONCTIONS PURES)
// =======================
const getWindDirectionIcon = (
  windData: number | string | undefined
): { symbol: string; label: string } => {
  if (windData === undefined || windData === null) {
    return { symbol: 'N/A', label: 'Tsy fantatra' };
  }

  if (typeof windData === 'string') {
    return { symbol: windData, label: windData };
  }

  const directions = [
    { degrees: 0, label: 'Avaratra', symbol: '↓' },
    { degrees: 90, label: 'Atsinanana', symbol: '→' },
    { degrees: 180, label: 'Atsimo', symbol: '↑' },
    { degrees: 270, label: 'Andrefana', symbol: '←' }
  ];

  const closest = directions.reduce((prev, curr) =>
    Math.abs(curr.degrees - windData) <
    Math.abs(prev.degrees - windData)
      ? curr
      : prev
  );

  return closest;
};

// =======================
// COMPOSANT PRINCIPAL
// =======================
const HomePage: React.FC = () => {
  const {
    currentWeather,
    dailyForecast,
    loading,
    error,
    location
  } = useWeather(CONFIG.LOCATION, CONFIG.FORECAST_DAYS);

  // ✅ HOOK APPELÉ AU BON ENDROIT
  const { alerts, advice } = useFarmingLogic(currentWeather);

  const windDirection = useMemo(() => {
    if (!currentWeather) {
      return { symbol: 'N/A', label: 'Tsy fantatra' };
    }
    return getWindDirectionIcon(
      currentWeather.wind_degree ?? currentWeather.wind_dir
    );
  }, [currentWeather]);

  // =======================
  // GESTION DES ÉTATS
  // =======================
  if (loading) return <WeatherSkeleton />;

  if (error) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold">Erreur</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!currentWeather || !dailyForecast?.length || !location) {
    return (
      <div className="p-6 text-center">
        <p>Aucune donnée météo disponible</p>
      </div>
    );
  }

  // =======================
  // RENDER
  // =======================
  return (
    <div className="min-h-screen p-4 bg-green-50">
      <HeaderSection location={location} />

      <CurrentWeatherSection
        currentWeather={currentWeather}
        windDirection={windDirection}
      />

      <ForecastSection dailyForecast={dailyForecast} />

      <div className="grid gap-6 mt-6 lg:grid-cols-2">
        <AlertsSection alerts={alerts} />
        <AdviceSection advice={advice} />
      </div>
    </div>
  );
};

// =======================
// SOUS-COMPOSANTS
// =======================
const HeaderSection: React.FC<{ location: Location }> = ({ location }) => (
  <header className="mb-6">
    <h1 className="text-3xl font-bold">Dashboard Tantsaha</h1>
    <p className="text-gray-600">
      {location.name} — {location.region}
    </p>
  </header>
);

const CurrentWeatherSection: React.FC<{
  currentWeather: CurrentWeather;
  windDirection: { symbol: string; label: string };
}> = ({ currentWeather, windDirection }) => (
  <section className="p-6 mb-6 bg-white shadow rounded-xl">
    <h2 className="mb-4 text-xl font-bold">Toetrandro ankehitriny</h2>
    <p className="text-4xl font-bold">{currentWeather.temp_c}°C</p>
    <p className="text-gray-600">
      Rivotra : {currentWeather.wind_kph} km/h ({windDirection.label})
    </p>
  </section>
);

const ForecastSection: React.FC<{ dailyForecast: ForecastDay[] }> = ({
  dailyForecast
}) => (
  <section className="p-6 bg-white shadow rounded-xl">
    <h2 className="mb-4 text-xl font-bold">Prévisions</h2>
    <div className="grid gap-4 md:grid-cols-3">
      {dailyForecast.slice(0, 3).map(day => (
        <div key={day.date} className="p-4 rounded-lg bg-gray-50">
          <p className="font-bold">{day.day.avgtemp_c}°C</p>
          <p className="text-sm">{day.day.condition.text}</p>
        </div>
      ))}
    </div>
  </section>
);

const AlertsSection: React.FC<{ alerts: any[] }> = ({ alerts }) => (
  <section className="p-6 bg-white shadow rounded-xl">
    <h3 className="mb-4 text-lg font-bold">Fampandrenesana</h3>
    {alerts.length === 0 ? (
      <p>Aucune alerte</p>
    ) : (
      alerts.map((a, i) => (
        <div key={i} className="p-3 mb-2 rounded bg-red-50">
          {a.title}
        </div>
      ))
    )}
  </section>
);

const AdviceSection: React.FC<{ advice: any[] }> = ({ advice }) => (
  <section className="p-6 bg-white shadow rounded-xl">
    <h3 className="mb-4 text-lg font-bold">Torolalana</h3>
    {advice.map((a, i) => (
      <div key={i} className="p-3 mb-2 rounded bg-green-50">
        {a.title}
      </div>
    ))}
  </section>
);

const WeatherSkeleton: React.FC = () => (
  <div className="p-8 text-center animate-pulse">Chargement…</div>
);

export default HomePage;
