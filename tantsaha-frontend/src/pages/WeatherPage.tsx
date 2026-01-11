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

const MALAGASY_CITIES = [
  { name: 'Antananarivo', region: 'Analamanga' },
  { name: 'Toamasina', region: 'Atsinanana' },
  { name: 'Antsirabe', region: 'Vakinankaratra' },
  { name: 'Mahajanga', region: 'Boeny' },
  { name: 'Fianarantsoa', region: 'Haute Matsiatra' }
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
                        onClick={() => { setSelectedCity(city.name); setSearchQuery(''); }}
                        className="w-full px-4 py-2 text-left border-b hover:bg-gray-50 last:border-0"
                      >
                        {city.name} ({city.region})
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setTemperatureUnit('C')}
                  className={`px-3 py-1 rounded ${temperatureUnit === 'C' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                  °C
                </button>
                <button
                  onClick={() => setTemperatureUnit('F')}
                  className={`px-3 py-1 rounded ${temperatureUnit === 'F' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                  °F
                </button>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center justify-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
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
        {currentWeather && dailyForecast?.[0] && (
          <div className="mb-8">
            {/* AJOUT : relative et overflow-hidden ici */}
            <div className="relative overflow-hidden shadow-lg bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl">
              
              {/* AJOUT : L'effet de pluie animé */}
              {currentWeather.precip_mm > 0 && <RainEffect />}

              {/* AJOUT : relative et z-10 pour passer au-dessus de la pluie */}
              <div className="relative z-10 p-6 text-white md:p-8">
                <div className="flex flex-col items-center justify-between lg:flex-row">
                  <div className="mb-6 text-center lg:text-left lg:mb-0">
                    <div className="flex flex-col items-center mb-4 lg:flex-row lg:justify-start">
                      <img
                        src={`https:${currentWeather.condition.icon}`}
                        alt={currentWeather.condition.text}
                        className="w-24 h-24"
                      />
                      <div className="mt-4 lg:mt-0 lg:ml-6">
                        <div className="text-6xl font-bold">
                          {convertTemp(currentWeather.temp_c).toFixed(1)}°
                          <span className="text-3xl">{temperatureUnit}</span>
                        </div>
                        <p className="mt-2 text-2xl">{currentWeather.condition.text}</p>
                      </div>
                    </div>
                    <p className="text-lg">
                      T° ressentie: {convertTemp(currentWeather.feelslike_c).toFixed(1)}°{temperatureUnit}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4 bg-white/20 backdrop-blur-sm rounded-xl">
                    <div className="p-3 text-center">
                      <div className="text-sm">Hamandoana</div>
                      <div className="text-xl font-bold">{currentWeather.humidity}%</div>
                    </div>
                    <div className="p-3 text-center">
                      <div className="text-sm">Rivotra</div>
                      <div className="text-xl font-bold">{currentWeather.wind_kph} km/h</div>
                    </div>
                    <div className="p-3 text-center">
                      <div className="text-sm">Orana</div>
                      <div className="text-xl font-bold">{currentWeather.precip_mm} mm</div>
                    </div>
                    <div className="p-3 text-center">
                      <div className="text-sm">UV</div>
                      <div className="text-xl font-bold">{currentWeather.uv}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          {activeTab === 'today' && dailyForecast?.[0] && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="p-6 bg-white shadow-lg rounded-2xl">
                <h3 className="flex items-center mb-6 text-xl font-bold">
                  <FaSun className="mr-3 text-yellow-500" />
                  Masoandro sy Volana
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                    <div className="flex items-center">
                      <FaSun className="mr-4 text-2xl text-yellow-500" />
                      <div>
                        <div className="font-bold">Masoandro miposaka</div>
                        <div>{dailyForecast[0].astro?.sunrise || '06:00'}</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">🌅</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl">
                    <div className="flex items-center">
                      <FaMoon className="mr-4 text-2xl text-indigo-500" />
                      <div>
                        <div className="font-bold">Masoandro milentika</div>
                        <div>{dailyForecast[0].astro?.sunset || '18:00'}</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">🌇</div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white shadow-lg rounded-2xl">
                <h3 className="mb-6 text-xl font-bold">Toetrandro isan'ora</h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {['Maraina', "Tolak'andro", 'Hariva', 'Alina'].map((period, idx) => (
                    <div key={idx} className="p-4 text-center border border-gray-200 rounded-lg">
                      <div className="font-bold">{period}</div>
                      <div className="my-2 text-2xl font-bold text-blue-600">
                        {convertTemp((currentWeather?.temp_c || 25) + [-2, 2, -1, -4][idx]).toFixed(0)}°
                        <span className="text-sm">{temperatureUnit}</span>
                      </div>
                      <img
                        src={`https:${currentWeather?.condition.icon}`}
                        alt="weather"
                        className="w-12 h-12 mx-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'week' && dailyForecast && (
            <div className="overflow-hidden bg-white shadow-lg rounded-2xl">
              <div className="p-6">
                <h3 className="mb-6 text-xl font-bold">Toetrandro 3 andro</h3>
                <div className="space-y-3">
                  {dailyForecast.map((day) => (
                    <div key={day.date} className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={`https:${day.day.condition.icon}`}
                            alt={day.day.condition.text}
                            className="w-12 h-12 mr-4"
                          />
                          <div>
                            <div className="font-bold">
                              {new Date(day.date).toLocaleDateString('mg-MG', { weekday: 'long' })}
                            </div>
                            <div className="text-sm text-gray-600">{day.date}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-8">
                          <div className="text-center">
                            <div className="font-bold">
                              {convertTemp(day.day.avgtemp_c).toFixed(0)}°{temperatureUnit}
                            </div>
                            <div className="text-xs text-gray-600">Salamy</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="font-bold">
                              {convertTemp(day.day.maxtemp_c).toFixed(0)}°
                            </div>
                            <div className="text-xs text-gray-600">Ambony</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="font-bold">
                              {convertTemp(day.day.mintemp_c).toFixed(0)}°
                            </div>
                            <div className="text-xs text-gray-600">Ambany</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maps' && (
            <div className="p-6 bg-white shadow-lg rounded-2xl">
              <h3 className="mb-6 text-xl font-bold">
                Sarin'ny toetrandro eto Madagasikara
              </h3>
              
              <div className="mb-6">
                <div className="flex space-x-2">
                  {['temperature', 'rain', 'wind'].map((type) => (
                    <button
                      key={type}
                      className="flex items-center px-4 py-2 bg-gray-100 rounded-lg"
                    >
                      {type === 'temperature' && <FaThermometerHalf className="mr-2" />}
                      {type === 'rain' && <FaCloudRain className="mr-2" />}
                      {type === 'wind' && <FaWind className="mr-2" />}
                      {type === 'temperature' ? 'Hafanana' : type === 'rain' ? 'Orana' : 'Rivotra'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-center bg-gray-100 border border-gray-300 aspect-video rounded-xl">
                <p className="text-gray-600">Kaonty fandraisana sarintany ho avy...</p>
              </div>
            </div>
          )}
        </div>

        {/* Conseils agricoles (Rétabli complètement) */}
        {currentWeather && (
          <div className="p-6 mt-12 border border-green-200 bg-green-50 rounded-2xl">
            <h3 className="flex items-center mb-6 text-xl font-bold">
              <FaCloudRain className="mr-3 text-green-600" />
              Torolalana ho an'ny fambolena
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="p-5 bg-white border border-green-200 rounded-xl">
                <div className="flex items-center mb-3">
                  <FaThermometerHalf className="mr-3 text-red-500" />
                  <div>
                    <h4 className="font-bold">Hafanana</h4>
                    <p className="text-2xl font-bold">{currentWeather.temp_c}°C</p>
                  </div>
                </div>
                <p>{currentWeather.temp_c > 30 ? 'Mafana loatra - Aza manamboatra' : 'Andro tsara hanaovana asa'}</p>
              </div>
              
              <div className="p-5 bg-white border border-blue-200 rounded-xl">
                <div className="flex items-center mb-3">
                  <FaCloudRain className="mr-3 text-blue-500" />
                  <div>
                    <h4 className="font-bold">Orana</h4>
                    <p className="text-2xl font-bold">{currentWeather.precip_mm} mm</p>
                  </div>
                </div>
                <p>{currentWeather.precip_mm > 10 ? 'Orana be - Aza mamoaka zezika' : 'Andro tsara handondrahana'}</p>
              </div>
              
              <div className="p-5 bg-white border border-yellow-200 rounded-xl">
                <div className="flex items-center mb-3">
                  <FaSun className="mr-3 text-yellow-500" />
                  <div>
                    <h4 className="font-bold">UV</h4>
                    <p className="text-2xl font-bold">{currentWeather.uv}</p>
                  </div>
                </div>
                <p>{currentWeather.uv >= 8 ? 'Tafahoatra - Mampiasa solon-tanana' : 'Avony - Aza miasa ela'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="p-4 mt-8 text-sm text-center text-gray-600 border-t">
        <p>Angona avy amin'ny toetrandro</p>
        <p className="mt-1">
          Nohavaozina tamin'ny {new Date().toLocaleTimeString('mg-MG', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </footer>
    </div>
  );
};

export default WeatherPage;