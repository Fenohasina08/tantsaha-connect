 import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useWeather } from '../hooks/useWeather';
import { 
  FaCalendarAlt,
  FaChartLine,
  FaMapMarkerAlt,
  FaSearch,
  FaSun,
  FaMoon,
  FaTint,
  FaWind,
  FaThermometerHalf,
  FaCloudRain,
  FaEye,
  FaArrowUp,
  FaArrowDown,
  FaSync,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa';
import { WiBarometer, WiHumidity, WiRaindrop } from 'react-icons/wi';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// ============================================================================
// TYPES ET INTERFACES
// ============================================================================

interface CurrentWeather {
  temp_c: number;
  feelslike_c: number;
  condition: {
    text: string;
    icon: string;
  };
  wind_kph: number;
  wind_dir?: string;
  humidity: number;
  precip_mm: number;
  pressure_mb: number;
  uv: number;
  vis_km?: number;
  last_updated?: string;
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
    totalprecip_mm: number;
  };
  astro?: {
    sunrise: string;
    sunset: string;
  };
  hour?: HourlyForecast[];
}

interface HourlyForecast {
  time: string;
  time_epoch: number;
  temp_c: number;
  condition: {
    text: string;
    icon: string;
  };
  chance_of_rain: number;
}

interface Location {
  name: string;
  region: string;
}

interface City {
  name: string;
  region: string;
}

interface WeatherMetricProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description: string;
  unit?: string;
  ariaLabel?: string;
}

interface TodayTabProps {
  currentWeather: CurrentWeather;
  todayForecast: ForecastDay;
  convertTemp: (temp: number) => number;
  unit: string;
}

interface WeekTabProps {
  forecast: ForecastDay[];
  convertTemp: (temp: number) => number;
  unit: string;
}

interface HourlyTabProps {
  hourlyData: HourlyForecast[];
  convertTemp: (temp: number) => number;
  unit: string;
}

interface MapsTabProps {
  selectedCity: string;
}

interface AgriculturalAdviceProps {
  condition: 'temperature' | 'rain' | 'uv';
  value: number;
  title: string;
  advice: string;
  icon: React.ReactNode;
}

// ============================================================================
// DONNÉES ET CONSTANTES
// ============================================================================

const MALAGASY_CITIES: City[] = [
  { name: 'Antananarivo', region: 'Analamanga' },
  { name: 'Toamasina', region: 'Atsinanana' },
  { name: 'Antsirabe', region: 'Vakinankaratra' },
  { name: 'Mahajanga', region: 'Boeny' },
  { name: 'Fianarantsoa', region: 'Haute Matsiatra' },
  { name: 'Toliara', region: 'Atsimo-Andrefana' },
  { name: 'Antsiranana', region: 'Diana' },
  { name: 'Morondava', region: 'Menabe' },
  { name: 'Sambava', region: 'Sava' },
  { name: 'Ambilobe', region: 'Diana' }
];

const TAB_CONFIG = [
  { id: 'today', label: 'Androany', icon: FaSun },
  { id: 'week', label: 'Herinandro', icon: FaCalendarAlt },
  { id: 'hourly', label: 'Isa-orana', icon: FaChartLine },
  { id: 'maps', label: "Sarin'ny toetrandro", icon: FaMapMarkerAlt }
] as const;

// ============================================================================
// COMPOSANTS UTILITAIRES
// ============================================================================

const WeatherMetric: React.FC<WeatherMetricProps> = ({ 
  icon, 
  label, 
  value, 
  description, 
  unit,
  ariaLabel 
}) => (
  <div className="p-3 text-center">
    <div className="flex justify-center mb-2 text-2xl">{icon}</div>
    <div className="text-sm opacity-90">{label}</div>
    <div className="text-xl font-bold">
      {value}
      {unit && <span className="ml-1">{unit}</span>}
    </div>
    <div className="text-xs opacity-80">{description}</div>
  </div>
);

const TodayTab: React.FC<TodayTabProps> = ({ 
  currentWeather, 
  todayForecast, 
  convertTemp, 
  unit 
}) => {
  const timePeriods = [
    { label: 'Maraina', tempAdjust: -2 },
    { label: "Tolak'andro", tempAdjust: 2 },
    { label: 'Hariva', tempAdjust: -1 },
    { label: 'Alina', tempAdjust: -4 }
  ];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="p-6 bg-white shadow-lg rounded-2xl">
        <h3 className="flex items-center mb-6 text-xl font-bold text-gray-800">
          <FaSun className="mr-3 text-yellow-500" />
          Masoandro sy Volana
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
            <div className="flex items-center">
              <FaSun className="mr-4 text-2xl text-yellow-500" />
              <div>
                <div className="font-bold text-gray-800">Masoandro miposaka</div>
                <div className="text-gray-600">{todayForecast.astro?.sunrise || '06:00'}</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-yellow-600">🌅</div>
          </div>
          <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl">
            <div className="flex items-center">
              <FaMoon className="mr-4 text-2xl text-indigo-500" />
              <div>
                <div className="font-bold text-gray-800">Masoandro milentika</div>
                <div className="text-gray-600">{todayForecast.astro?.sunset || '18:00'}</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-indigo-600">🌇</div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white shadow-lg rounded-2xl">
        <h3 className="mb-6 text-xl font-bold text-gray-800">Toetrandro isan'ora</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {timePeriods.map((period, idx) => (
            <div key={idx} className="p-4 text-center border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md">
              <div className="font-bold text-gray-800">{period.label}</div>
              <div className="my-2 text-2xl font-bold text-blue-600">
                {convertTemp(currentWeather.temp_c + period.tempAdjust).toFixed(0)}°
                <span className="text-sm">{unit}</span>
              </div>
              <LazyLoadImage
                src={`https:${currentWeather.condition.icon}`}
                alt={currentWeather.condition.text}
                className="w-12 h-12 mx-auto"
                effect="blur"
              />
              <div className="mt-2 text-sm text-gray-600 capitalize">
                {currentWeather.condition.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WeekTab: React.FC<WeekTabProps> = ({ forecast, convertTemp, unit }) => {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const toggleDay = (date: string) => {
    setExpandedDay(expandedDay === date ? null : date);
  };

  return (
    <div className="overflow-hidden bg-white shadow-lg rounded-2xl">
      <div className="p-6">
        <h3 className="mb-6 text-xl font-bold text-gray-800">Toetrandro 7 andro</h3>
        <div className="space-y-3">
          {forecast.map((day) => (
            <div key={day.date} className="overflow-hidden border border-gray-200 rounded-xl hover:border-blue-300">
              <button
                onClick={() => toggleDay(day.date)}
                className="w-full p-4 text-left hover:bg-gray-50 focus:outline-none"
              >
                <div className="flex flex-col items-center justify-between md:flex-row">
                  <div className="flex items-center w-full md:w-auto">
                    <div className="flex-shrink-0 mr-4">
                      <LazyLoadImage
                        src={`https:${day.day.condition.icon}`}
                        alt={day.day.condition.text}
                        className="w-12 h-12"
                        effect="blur"
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-gray-800">
                        {new Date(day.date).toLocaleDateString('mg-MG', { weekday: 'long' })}
                      </div>
                      <div className="text-sm text-gray-600">{day.date}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center w-full mt-4 md:w-auto md:mt-0">
                    <div className="flex items-center flex-1 space-x-4 md:flex-none md:space-x-8">
                      <div className="text-center">
                        <div className="font-bold text-gray-800">
                          {convertTemp(day.day.avgtemp_c).toFixed(0)}°{unit}
                        </div>
                        <div className="text-xs text-gray-600">Salamy</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <FaArrowUp className="text-red-500" />
                          <span className="font-bold text-gray-800">
                            {convertTemp(day.day.maxtemp_c).toFixed(0)}°
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">Ambony</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <FaArrowDown className="text-blue-500" />
                          <span className="font-bold text-gray-800">
                            {convertTemp(day.day.mintemp_c).toFixed(0)}°
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">Ambany</div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      {expandedDay === day.date ? (
                        <FaChevronDown className="text-gray-500" />
                      ) : (
                        <FaChevronRight className="text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>
              </button>
              
              {expandedDay === day.date && (
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="p-3 text-center bg-white rounded-lg">
                      <div className="font-bold text-gray-800">{day.day.daily_chance_of_rain}%</div>
                      <div className="text-xs text-gray-600">Metaky orana</div>
                    </div>
                    <div className="p-3 text-center bg-white rounded-lg">
                      <div className="font-bold text-gray-800">{day.day.maxwind_kph} km/h</div>
                      <div className="text-xs text-gray-600">Rivotra</div>
                    </div>
                    <div className="p-3 text-center bg-white rounded-lg">
                      <div className="font-bold text-gray-800">{day.day.avghumidity}%</div>
                      <div className="text-xs text-gray-600">Hamandoana</div>
                    </div>
                    <div className="p-3 text-center bg-white rounded-lg">
                      <div className="font-bold text-gray-800">{day.day.totalprecip_mm} mm</div>
                      <div className="text-xs text-gray-600">Rotsak'orana</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HourlyTab: React.FC<HourlyTabProps> = ({ hourlyData, convertTemp, unit }) => {
  const [currentHourIndex, setCurrentHourIndex] = useState(0);

  useEffect(() => {
    if (hourlyData?.length > 0) {
      const now = new Date();
      const currentHour = now.getHours();
      const index = hourlyData.findIndex(hour => {
        const hourTime = parseInt(hour.time.split(' ')[1].split(':')[0]);
        return hourTime >= currentHour;
      });
      setCurrentHourIndex(Math.max(0, index));
    }
  }, [hourlyData]);

  const visibleHours = hourlyData?.slice(currentHourIndex, currentHourIndex + 12) || [];

  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Toetrandro isa-orana</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentHourIndex(prev => Math.max(0, prev - 1))}
            disabled={currentHourIndex === 0}
            className="p-2 text-gray-600 disabled:opacity-50 hover:text-blue-600"
          >
            <FaChevronRight className="rotate-180" />
          </button>
          <button
            onClick={() => setCurrentHourIndex(prev => Math.min(hourlyData.length - 12, prev + 1))}
            disabled={currentHourIndex >= (hourlyData?.length || 0) - 12}
            className="p-2 text-gray-600 disabled:opacity-50 hover:text-blue-600"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
      
      <div className="flex pb-6 space-x-4 overflow-x-auto">
        {visibleHours.map((hour) => {
          const hourTime = hour.time.split(' ')[1];
          const isNow = currentHourIndex === 0;
          
          return (
            <div 
              key={hour.time_epoch}
              className="flex-shrink-0 p-4 text-center border border-gray-200 w-28 rounded-xl hover:border-blue-300 hover:shadow-md"
            >
              <div className="font-bold text-gray-800">
                {hourTime}
                {isNow && (
                  <span className="block text-xs font-normal text-blue-600">Ankehitriny</span>
                )}
              </div>
              <LazyLoadImage
                src={`https:${hour.condition.icon}`}
                alt={hour.condition.text}
                className="w-12 h-12 mx-auto my-2"
                effect="blur"
              />
              <div className="text-xl font-bold text-gray-800">
                {convertTemp(hour.temp_c).toFixed(0)}°
                <span className="text-sm">{unit}</span>
              </div>
              <div className="text-sm text-gray-600 capitalize truncate">
                {hour.condition.text}
              </div>
              <div className="flex items-center justify-center mt-2 space-x-1">
                <FaCloudRain className="text-blue-400" />
                <span className="text-xs">{hour.chance_of_rain}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MapsTab: React.FC<MapsTabProps> = ({ selectedCity }) => {
  const [mapType, setMapType] = useState<'temperature' | 'rain' | 'wind'>('temperature');
  
  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl">
      <h3 className="mb-6 text-xl font-bold text-gray-800">
        Sarin'ny toetrandro eto Madagasikara
      </h3>
      
      <div className="mb-6">
        <div className="flex pb-2 space-x-2 overflow-x-auto">
          {[
            { id: 'temperature', label: 'Hafanana', icon: FaThermometerHalf },
            { id: 'rain', label: "Rotsak'orana", icon: FaCloudRain },
            { id: 'wind', label: 'Rivotra', icon: FaWind }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setMapType(type.id as any)}
              className={`flex items-center px-4 py-2 rounded-lg ${
                mapType === type.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <type.icon className="mr-2" />
              {type.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="relative overflow-hidden border border-gray-300 aspect-video bg-gradient-to-br from-blue-100 to-green-100 rounded-xl">
        <div className="absolute p-4 rounded-lg bottom-4 left-4 bg-white/90 backdrop-blur-sm">
          <p className="font-bold text-gray-700">{selectedCity}</p>
          <p className="text-sm text-gray-600">Kaonty fandraisana sarintany ho avy...</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-4">
        {[
          { region: "Tendron'i Nosy", temp: 25, condition: "Maivanana" },
          { region: "Afovoan-tany", temp: 20, condition: "Mangatsiaka" },
          { region: "Atsinanana", temp: 28, condition: "Mafana sy orana" },
          { region: "Andrefana", temp: 30, condition: "Maina sy mafana" }
        ].map((region, idx) => (
          <div key={idx} className="p-4 text-center border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm">
            <div className="font-bold text-gray-800">{region.region}</div>
            <div className="my-2 text-2xl font-bold text-blue-600">{region.temp}°C</div>
            <div className="text-sm text-gray-600">{region.condition}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AgriculturalAdvice: React.FC<AgriculturalAdviceProps> = ({ 
  condition, 
  value, 
  title, 
  advice, 
  icon 
}) => {
  const getColorConfig = () => {
    switch(condition) {
      case 'temperature':
        return value > 30 
          ? { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' }
          : value < 15 
            ? { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' }
            : { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' };
      case 'rain':
        return value > 10 
          ? { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' }
          : value > 2 
            ? { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-800' }
            : { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' };
      case 'uv':
        return value >= 8 
          ? { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800' }
          : value >= 5 
            ? { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' }
            : { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800' };
    }
  };

  const colors = getColorConfig();
  const unit = condition === 'temperature' ? '°C' : condition === 'rain' ? 'mm' : '';

  return (
    <div className={`p-5 rounded-xl border ${colors.bg} ${colors.border} hover:scale-[1.02] hover:shadow-md`}>
      <div className="flex items-center mb-3">
        <div className="p-3 bg-white rounded-full shadow-sm">
          {icon}
        </div>
        <div className="ml-4">
          <h4 className="font-bold text-gray-800">{title}</h4>
          <p className={`text-2xl font-bold ${colors.text}`}>
            {value}{unit}
          </p>
        </div>
      </div>
      <p className="leading-relaxed text-gray-700">{advice}</p>
    </div>
  );
};

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

const WeatherPage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('Antananarivo');
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'hourly' | 'maps'>('today');
  const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { currentWeather, dailyForecast, loading, error, location, refresh } = useWeather(
    selectedCity, 
    7
  );

  const handleCityChange = useCallback((city: string) => {
    setSelectedCity(city);
    setSearchQuery('');
  }, []);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await refresh();
      setRetryCount(0);
    } catch (err) {
      console.error('Erreur lors du rafraîchissement:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, refresh]);

  const handleRetry = useCallback(() => {
    if (retryCount >= 3) {
      window.location.reload();
      return;
    }
    
    setRetryCount(prev => prev + 1);
    setTimeout(() => {
      handleRefresh();
    }, 2000);
  }, [retryCount, handleRefresh]);

  const convertTemp = useCallback((tempC: number): number => {
    return temperatureUnit === 'C' ? tempC : (tempC * 9/5) + 32;
  }, [temperatureUnit]);

  const filteredCities = useMemo(() => {
    if (!searchQuery) return MALAGASY_CITIES;
    return MALAGASY_CITIES.filter(city => 
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.region.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  if (loading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="text-lg text-gray-700">Mampakatra ny toetrandro...</p>
          <p className="text-sm text-gray-500">Antananarivo, Madagascar</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container p-6 mx-auto">
          <div className="p-8 text-center bg-white border border-red-200 shadow-lg rounded-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-red-100 rounded-full">
              <FaExclamationTriangle className="text-3xl text-red-600" />
            </div>
            <h1 className="mb-4 text-2xl font-bold text-gray-900">Diso ny angona</h1>
            <p className="max-w-md mx-auto mb-6 text-gray-700">{error}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={handleRetry}
                disabled={isRefreshing}
                className="px-6 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isRefreshing ? 'Miandry...' : `Andramo indray (${retryCount + 1}/3)`}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50">
      <div className="sticky top-0 z-10 p-4 border-b border-gray-200 shadow-sm bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
                <FaMapMarkerAlt className="inline mr-2 text-red-500" />
                Toetrandro Malagasy
              </h1>
              {location && (
                <p className="mt-1 text-gray-600">
                  <span className="font-semibold text-blue-700">{location.name}</span>, {location.region}
                  <span className="px-2 py-1 ml-2 text-sm text-blue-800 bg-blue-100 rounded-full">
                    {new Date().toLocaleDateString('mg-MG', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
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
                  <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg top-full">
                    {filteredCities.map(city => (
                      <button
                        key={city.name}
                        onClick={() => handleCityChange(city.name)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50"
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
                  className={`px-3 py-1 rounded-md ${temperatureUnit === 'C' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  °C
                </button>
                <button
                  onClick={() => setTemperatureUnit('F')}
                  className={`px-3 py-1 rounded-md ${temperatureUnit === 'F' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  °F
                </button>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center justify-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-blue-700 disabled:opacity-50"
              >
                <FaSync className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Miandry...' : 'Havaozy'}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <nav className="flex space-x-2 overflow-x-auto">
              {TAB_CONFIG.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 whitespace-nowrap rounded-lg ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
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
            <div className="overflow-hidden shadow-xl bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl">
              <div className="p-6 text-white md:p-8">
                <div className="flex flex-col items-center justify-between lg:flex-row">
                  <div className="mb-6 text-center lg:text-left lg:mb-0">
                    <div className="flex flex-col items-center mb-4 lg:flex-row lg:justify-start">
                      <LazyLoadImage
                        src={`https:${currentWeather.condition.icon.replace('64x64', '128x128')}`}
                        alt={currentWeather.condition.text}
                        className="w-24 h-24 filter drop-shadow-lg"
                        effect="blur"
                      />
                      <div className="mt-4 lg:mt-0 lg:ml-6">
                        <div className="text-6xl font-bold md:text-7xl">
                          {convertTemp(currentWeather.temp_c).toFixed(1)}°
                          <span className="text-3xl opacity-90">{temperatureUnit}</span>
                        </div>
                        <p className="mt-2 text-2xl capitalize">{currentWeather.condition.text}</p>
                      </div>
                    </div>
                    <p className="text-lg opacity-90">
                      T° ressentie: {convertTemp(currentWeather.feelslike_c).toFixed(1)}°{temperatureUnit} • 
                      Andro feno masoandro
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <WeatherMetric 
                      icon={<WiHumidity className="text-2xl" />}
                      label="Hamandoana"
                      value={currentWeather.humidity}
                      unit="%"
                      description={currentWeather.humidity > 80 ? "Be" : "Ara-dalàna"}
                    />
                    <WeatherMetric 
                      icon={<FaWind className="text-xl" />}
                      label="Rivotra"
                      value={currentWeather.wind_kph}
                      unit="km/h"
                      description={currentWeather.wind_dir || 'Tsy fantatra'}
                    />
                    <WeatherMetric 
                      icon={<WiRaindrop className="text-2xl" />}
                      label="Rotsak'orana"
                      value={currentWeather.precip_mm}
                      unit="mm"
                      description={currentWeather.precip_mm > 5 ? "Be" : "Tsy misy"}
                    />
                    <WeatherMetric 
                      icon={<FaEye className="text-xl" />}
                      label="Fahitana"
                      value={currentWeather.vis_km || 10}
                      unit="km"
                      description="Tsara"
                    />
                    <WeatherMetric 
                      icon={<WiBarometer className="text-2xl" />}
                      label="Fananterana"
                      value={currentWeather.pressure_mb}
                      unit="hPa"
                      description="Ara-dalàna"
                    />
                    <WeatherMetric 
                      icon={<FaThermometerHalf className="text-xl" />}
                      label="Indrisy UV"
                      value={currentWeather.uv.toFixed(1)}
                      description={currentWeather.uv > 8 ? "Tafahoatra" : "Antonony"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          {activeTab === 'today' && currentWeather && dailyForecast?.[0] && (
            <TodayTab 
              currentWeather={currentWeather} 
              todayForecast={dailyForecast[0]} 
              convertTemp={convertTemp} 
              unit={temperatureUnit} 
            />
          )}

          {activeTab === 'week' && dailyForecast && dailyForecast.length > 0 && (
            <WeekTab 
              forecast={dailyForecast} 
              convertTemp={convertTemp} 
              unit={temperatureUnit} 
            />
          )}

          {activeTab === 'hourly' && dailyForecast?.[0]?.hour && (
            <HourlyTab 
              hourlyData={dailyForecast[0].hour} 
              convertTemp={convertTemp} 
              unit={temperatureUnit} 
            />
          )}

          {activeTab === 'maps' && (
            <MapsTab selectedCity={selectedCity} />
          )}
        </div>

        {currentWeather && (
          <div className="p-6 mt-12 border border-green-200 shadow-lg bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl">
            <h3 className="flex items-center mb-6 text-2xl font-bold text-gray-800">
              <FaChartLine className="mr-3 text-green-600" />
              Torolalana ho an'ny fambolena
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AgriculturalAdvice 
                condition="temperature"
                value={currentWeather.temp_c}
                title="Hafanana ankehitriny"
                advice={currentWeather.temp_c > 30 ? "Mafana loatra - Aza manamboatra zava-maniry eo anelanelan'ny 11h sy 15h" : 
                       currentWeather.temp_c < 15 ? "Mangatsiaka - Andro tsara hanafarana voa" : 
                       "Andro tsara hanaovana asa rehetra amin'ny fambolena"}
                icon={<FaThermometerHalf className="text-red-500" />}
              />
              <AgriculturalAdvice 
                condition="rain"
                value={currentWeather.precip_mm}
                title="Rotsak'orana"
                advice={currentWeather.precip_mm > 10 ? "Orana be - Aza mamoaka zezika na fanafody" : 
                       currentWeather.precip_mm > 2 ? "Andro tsara handondrahana rano" : 
                       "Maina - Ilaina ny fanondrahana rano"}
                icon={<FaCloudRain className="text-blue-500" />}
              />
              <AgriculturalAdvice 
                condition="uv"
                value={currentWeather.uv}
                title="Indrisy UV"
                advice={currentWeather.uv >= 8 ? "Tafahoatra - Mampiasa solon-tanana sy satroka" : 
                       currentWeather.uv >= 5 ? "Avony - Aza miasa ela eo amin'ny masoandro" : 
                       "Ambany - Andro tsara hanaovana asa ivelany"}
                icon={<FaSun className="text-yellow-500" />}
              />
            </div>
          </div>
        )}
      </div>

      <footer className="p-4 mt-8 text-sm text-center text-gray-600 border-t border-gray-200">
        <p>Angona avy amin'ny toetrandro • V2.0.0</p>
        <p className="mt-1">
          Nohavaozina tamin'ny{' '}
          {currentWeather?.last_updated 
            ? new Date(currentWeather.last_updated).toLocaleTimeString('mg-MG', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })
            : new Date().toLocaleTimeString('mg-MG', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })
          }
        </p>
      </footer>
    </div>
  );
};

export default WeatherPage;