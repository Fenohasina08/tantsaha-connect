 import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useWeather } from '../hooks/useWeather';
import RainEffect from '../hooks/RainEffect'; 
import { 
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaSun,
  FaMoon,
  FaWind,
  FaThermometerHalf,
  FaCloudRain,
  FaSync,
  FaExclamationTriangle
} from 'react-icons/fa';

// Import du composant Carte
import WeatherMap from '../components/layout/weather/WeatherMap';

// Types
interface CurrentWeather {
  temp_c: number;
  feelslike_c: number;
  condition: { text: string; icon: string };
  wind_kph: number;
  humidity: number;
  precip_mm: number;
  uv: number;
}

interface ForecastDay {
  date: string;
  day: {
    avgtemp_c: number;
    maxtemp_c: number;
    mintemp_c: number;
    condition: { text: string; icon: string };
    daily_chance_of_rain: number;
  };
  astro?: { sunrise: string; sunset: string };
}

type TabType = 'today' | 'week' | 'maps';

// Mise à jour de la liste avec les coordonnées GPS pour la carte
const MALAGASY_CITIES = [
  { name: 'Antananarivo', region: 'Analamanga', coordinates: [-18.8792, 47.5079] as [number, number] },
  { name: 'Toamasina', region: 'Atsinanana', coordinates: [-18.1492, 49.4023] as [number, number] },
  { name: 'Antsirabe', region: 'Vakinankaratra', coordinates: [-19.8659, 47.0333] as [number, number] },
  { name: 'Mahajanga', region: 'Boeny', coordinates: [-15.7167, 46.3167] as [number, number] },
  { name: 'Fianarantsoa', region: 'Haute Matsiatra', coordinates: [-21.4536, 47.0858] as [number, number] }
];

const TAB_CONFIG: { id: TabType; label: string; icon: any }[] = [
  { id: 'today', label: 'Androany', icon: FaSun },
  { id: 'week', label: 'Herinandro', icon: FaCalendarAlt },
  { id: 'maps', label: 'Sarintany', icon: FaMapMarkerAlt }
];

const WeatherPage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('Antananarivo');
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // État pour stocker les coordonnées de la ville sélectionnée pour la carte
  const [activeCoords, setActiveCoords] = useState<[number, number] | null>([-18.8792, 47.5079]);
  
  const { currentWeather, dailyForecast, loading, error, location, refresh } = useWeather(selectedCity, 3);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await refresh();
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, refresh]);

  const convertTemp = useCallback((tempC: number): number => {
    return temperatureUnit === 'C' ? tempC : (tempC * 9/5) + 32;
  }, [temperatureUnit]);

  const filteredCities = useMemo(() => {
    if (!searchQuery) return MALAGASY_CITIES;
    return MALAGASY_CITIES.filter(city => 
      city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  if (loading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="text-lg">Mampakatra ny toetrandro...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container p-6 mx-auto">
          <div className="p-8 text-center bg-white border border-red-200 rounded-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-red-100 rounded-full">
              <FaExclamationTriangle className="text-3xl text-red-600" />
            </div>
            <h1 className="mb-4 text-2xl font-bold">Diso ny angona</h1>
            <p className="max-w-md mx-auto mb-6 text-gray-700">{error}</p>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-6 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {isRefreshing ? 'Miandry...' : 'Andramo indray'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-20 p-4 bg-white border-b">
        <div className="container mx-auto">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold">
                <FaMapMarkerAlt className="inline mr-2 text-red-500" />
                Toetrandro Malagasy
              </h1>
              {location && (
                <p className="mt-1 text-gray-600">
                  <span className="font-semibold text-blue-700">{location.name}</span>, {location.region}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <div className="relative">
                  <FaSearch className="absolute text-gray-400 left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Hitadiava tanàna..."
                    className="w-full py-2 pl-10 pr-4 bg-white border border-gray-300 rounded-lg sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {searchQuery && filteredCities.length > 0 && (
                  <div className="absolute left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {filteredCities.map(city => (
                      <button
                        key={city.name}
                        onClick={() => { 
                          setSelectedCity(city.name); 
                          setActiveCoords(city.coordinates); // On envoie les coordonnées à la carte ici
                          setSearchQuery(''); 
                        }}
                        className="w-full px-4 py-2 text-left border-b hover:bg-blue-50 hover:text-blue-600 last:border-0"
                      >
                        {city.name} ({city.region})
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ... (Unité température et bouton Refresh identiques) ... */}
              <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                <button onClick={() => setTemperatureUnit('C')} className={`px-3 py-1 rounded ${temperatureUnit === 'C' ? 'bg-white shadow' : 'text-gray-600'}`}>°C</button>
                <button onClick={() => setTemperatureUnit('F')} className={`px-3 py-1 rounded ${temperatureUnit === 'F' ? 'bg-white shadow' : 'text-gray-600'}`}>°F</button>
              </div>
              <button onClick={handleRefresh} disabled={isRefreshing} className="flex items-center justify-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <FaSync className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Miandry...' : 'Havaozy'}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <nav className="flex space-x-2">
              {TAB_CONFIG.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-lg ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Icon className="mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="container p-4 mx-auto md:p-6">
        {/* Affichage Météo Actuelle avec RainEffect */}
        {currentWeather && dailyForecast?.[0] && (
          <div className="mb-8">
            <div className="relative overflow-hidden shadow-lg bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl">
              {currentWeather.precip_mm > 0 && <RainEffect />}
              <div className="relative z-10 p-6 text-white md:p-8">
                <div className="flex flex-col items-center justify-between lg:flex-row">
                  <div className="mb-6 text-center lg:text-left lg:mb-0">
                    <div className="flex flex-col items-center mb-4 lg:flex-row lg:justify-start">
                      <img src={`https:${currentWeather.condition.icon}`} alt={currentWeather.condition.text} className="w-24 h-24" />
                      <div className="mt-4 lg:mt-0 lg:ml-6">
                        <div className="text-6xl font-bold">{convertTemp(currentWeather.temp_c).toFixed(1)}°<span className="text-3xl">{temperatureUnit}</span></div>
                        <p className="mt-2 text-2xl">{currentWeather.condition.text}</p>
                      </div>
                    </div>
                  </div>
                  {/* ... (Stats: Humidité, Vent, etc.) ... */}
                  <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4 bg-white/20 backdrop-blur-sm rounded-xl">
                    <div className="p-3 text-center"><div>Hamandoana</div><div className="text-xl font-bold">{currentWeather.humidity}%</div></div>
                    <div className="p-3 text-center"><div>Rivotra</div><div className="text-xl font-bold">{currentWeather.wind_kph} km/h</div></div>
                    <div className="p-3 text-center"><div>Orana</div><div className="text-xl font-bold">{currentWeather.precip_mm} mm</div></div>
                    <div className="p-3 text-center"><div>UV</div><div className="text-xl font-bold">{currentWeather.uv}</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          {activeTab === 'today' && (
             /* ... Bloc Today identique ... */
             <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="p-6 bg-white shadow-lg rounded-2xl"><h3 className="flex items-center mb-6 text-xl font-bold"><FaSun className="mr-3 text-yellow-500" />Masoandro sy Volana</h3></div>
                <div className="p-6 bg-white shadow-lg rounded-2xl"><h3 className="mb-6 text-xl font-bold">Toetrandro isan'ora</h3></div>
             </div>
          )}

          {activeTab === 'week' && (
             /* ... Bloc Week identique ... */
             <div className="overflow-hidden bg-white shadow-lg rounded-2xl"><div className="p-6"><h3 className="mb-6 text-xl font-bold">Toetrandro 3 andro</h3></div></div>
          )}

          {/* ONGLET CARTES : C'est ici que le changement opère */}
          {activeTab === 'maps' && (
            <div className="p-6 bg-white shadow-lg rounded-2xl">
              <h3 className="mb-6 text-xl font-bold text-gray-800">
                Sarin'ny toetrandro eto Madagasikara
              </h3>
              
              <div className="mb-6">
                <div className="flex space-x-2">
                  {['temperature', 'rain', 'wind'].map((type) => (
                    <button key={type} className={`flex items-center px-4 py-2 rounded-lg ${type === 'temperature' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                      {type === 'temperature' ? 'Hafanana' : type === 'rain' ? 'Orana' : 'Rivotra'}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* AFFICHAGE DE LA CARTE RÉELLE 🌍 */}
              <div className="overflow-hidden border border-gray-200 shadow-inner rounded-xl aspect-video">
                <WeatherMap selectedCoords={activeCoords} />
              </div>
            </div>
          )}
        </div>

        {/* ... (Conseils agricoles et footer identiques) ... */}
      </div>
    </div>
  );
};

export default WeatherPage;