 import React, { useMemo } from 'react';
import { useWeather } from '../hooks/useWeather';
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

// CONSTANTES CONFIGURABLES
const CONFIG = {
  LOCATION: 'Antananarivo',
  FORECAST_DAYS: 3,
  WIND_STRONG_THRESHOLD: 20,
  RAIN_HEAVY_THRESHOLD: 10,
  UV_HIGH_THRESHOLD: 8,
  TEMP_HOT_THRESHOLD: 30,
  TEMP_COLD_THRESHOLD: 15
} as const;

// Types pour les directions du vent
type WindDirectionKey = 'N' | 'NNE' | 'NE' | 'ENE' | 'E' | 'ESE' | 'SE' | 'SSE' | 
                       'S' | 'SSW' | 'SW' | 'WSW' | 'W' | 'WNW' | 'NW' | 'NNW';

const WIND_DIRECTIONS: Record<WindDirectionKey, { degrees: number; symbol: string; label: string }> = {
  'N': { degrees: 0, symbol: '↓', label: 'Avaratra' },
  'NNE': { degrees: 22.5, symbol: '↘', label: 'Avaratra-Atsinanana' },
  'NE': { degrees: 45, symbol: '↘', label: 'Atsinanana-Avaratra' },
  'ENE': { degrees: 67.5, symbol: '→', label: 'Atsinanana' },
  'E': { degrees: 90, symbol: '→', label: 'Atsinanana' },
  'ESE': { degrees: 112.5, symbol: '↗', label: 'Atsinanana-Atsimo' },
  'SE': { degrees: 135, symbol: '↗', label: 'Atsimo-Atsinanana' },
  'SSE': { degrees: 157.5, symbol: '↑', label: 'Atsimo' },
  'S': { degrees: 180, symbol: '↑', label: 'Atsimo' },
  'SSW': { degrees: 202.5, symbol: '↖', label: 'Atsimo-Andrefana' },
  'SW': { degrees: 225, symbol: '↖', label: 'Andrefana-Atsimo' },
  'WSW': { degrees: 247.5, symbol: '←', label: 'Andrefana' },
  'W': { degrees: 270, symbol: '←', label: 'Andrefana' },
  'WNW': { degrees: 292.5, symbol: '↙', label: 'Andrefana-Avaratra' },
  'NW': { degrees: 315, symbol: '↙', label: 'Avaratra-Andrefana' },
  'NNW': { degrees: 337.5, symbol: '↓', label: 'Avaratra' }
} as const;

// Fonction utilitaire pour vérifier si une chaîne est une direction valide
const isValidWindDirection = (dir: string): dir is WindDirectionKey => {
  return dir in WIND_DIRECTIONS;
};

// Fonction utilitaire pour convertir en majuscules en toute sécurité
const safeToUpperCase = (str: unknown): string => {
  if (typeof str === 'string') {
    return str.toUpperCase();
  }
  return '';
};

// Fonction principale pour obtenir la direction du vent
const getWindDirectionIcon = (windData: number | string | undefined): { symbol: string; label: string } => {
  // Gestion des cas null/undefined
  if (windData === undefined || windData === null) {
    return { symbol: 'N/A', label: 'Tsy fantatra' };
  }
  
  // Si c'est une chaîne
  if (typeof windData === 'string') {
    const upperDir = safeToUpperCase(windData);
    
    // Type guard pour vérifier que c'est une direction valide
    if (isValidWindDirection(upperDir)) {
      return WIND_DIRECTIONS[upperDir];
    }
    
    // Si ce n'est pas une direction valide mais c'est une chaîne
    return { symbol: 'N/A', label: windData };
  }
  
  // Si c'est un nombre (wind_degree)
  const normalizedDegrees = windData % 360;
  const directions = Object.values(WIND_DIRECTIONS);
  const closest = directions.reduce((prev, curr) => 
    Math.abs(curr.degrees - normalizedDegrees) < Math.abs(prev.degrees - normalizedDegrees) ? curr : prev
  );
  
  return closest;
};

// Interfaces TypeScript
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

interface AlertData {
  type: 'high' | 'rain' | 'wind' | 'temp';
  title: string;
  message: string;
  icon: string;
  severity: 'high' | 'medium' | 'low';
}

interface AdviceData {
  icon: React.ReactNode;
  title: string;
  description: string;
  timeframe: string;
  priority: number;
}

const HomePage: React.FC = () => {
  const { currentWeather, dailyForecast, loading, error, location } = useWeather(
    CONFIG.LOCATION, 
    CONFIG.FORECAST_DAYS
  );

  // MÉMOISATION optimisée avec gestion de type correcte
  const windDirection = useMemo(() => {
    if (!currentWeather) return { symbol: 'N/A', label: 'Tsy fantatra' };
    
    // Récupération sécurisée des données
    const windData = (currentWeather as any).wind_degree ?? (currentWeather as any).wind_dir;
    
    return getWindDirectionIcon(windData);
  }, [currentWeather]);

  // DONNÉES POUR LES ALERTES
  const alerts = useMemo((): AlertData[] => {
    if (!currentWeather) return [];
    
    const weather = currentWeather as unknown as CurrentWeather;
    const alertsList: AlertData[] = [];
    
    if (weather.uv >= CONFIG.UV_HIGH_THRESHOLD) {
      alertsList.push({
        type: 'high',
        title: 'Indrisy UV tafahoatra',
        message: 'Aza mivoaka eo amin\'ny masoandro eo anelanelan\'ny 10h sy 14h. Mampiasa solon-tanana, solon-tanana ary satroka.',
        icon: '☀️',
        severity: 'high'
      });
    }
    
    if (weather.precip_mm > CONFIG.RAIN_HEAVY_THRESHOLD) {
      alertsList.push({
        type: 'rain',
        title: 'Rotsak\'orana be miandry',
        message: 'Aza manamboatra zava-maniry ankehitriny. Andraso ny tany ho maina. Ataovy ny fidinana rano.',
        icon: '🌧️',
        severity: 'medium'
      });
    }
    
    if (weather.wind_kph > CONFIG.WIND_STRONG_THRESHOLD) {
      alertsList.push({
        type: 'wind',
        title: 'Rivotra mahery',
        message: 'Ampiaro ny zana-kazo vao teraka. Mety ho simba ny ravinkazo. Aza manala lamba fanafody.',
        icon: '💨',
        severity: 'medium'
      });
    }
    
    if (weather.temp_c > CONFIG.TEMP_HOT_THRESHOLD) {
      alertsList.push({
        type: 'temp',
        title: 'Hafanana tafahoatra',
        message: 'Andro mafana be. Manondraho rano be kokoa ny zava-maniry. Ataovy amin\'ny maraina na hariva.',
        icon: '🔥',
        severity: 'medium'
      });
    }
    
    return alertsList;
  }, [currentWeather]);

  // CONSEILS CONTEXTUELS
  const farmingAdvice = useMemo((): AdviceData[] => {
    const advice: AdviceData[] = [];
    
    if (currentWeather) {
      const weather = currentWeather as unknown as CurrentWeather;
      
      if (weather.temp_c > 25 && weather.temp_c < 32) {
        advice.push({
          icon: <FaSeedling className="text-green-600" />,
          title: "Famafazana voa",
          description: "Andro tsara hanafarana ny voa karoty, salady, tongolo. Alohan'ny hamafazana, asio zezika organika.",
          timeframe: "Androany hatramin'ny alarobia",
          priority: 1
        });
      }
      
      if (weather.humidity < 40) {
        advice.push({
          icon: <FaWater className="text-blue-600" />,
          title: "Fandrarana rano",
          description: "Andro maina. Ampihenao ny fanondrahana rano. Ampiasàny rano miempo alohan'ny fanondrahana.",
          timeframe: "Androany hatramin'ny sabotsy",
          priority: 2
        });
      }
      
      if (weather.precip_mm < 2) {
        advice.push({
          icon: <FaBug className="text-amber-600" />,
          title: "Fikojakojana ny bibikely",
          description: "Jereo ny ravinkazo raha misy bibikely. Mety ilaina ny fanafody raha be loatra.",
          timeframe: "Androany",
          priority: 3
        });
      }
    }
    
    // Conseils par défaut si pas assez de conseils contextuels
    if (advice.length < 2) {
      advice.push(
        {
          icon: <FaLeaf className="text-emerald-600" />,
          title: "Famonoana ahidy",
          description: "Andro tsara hanafoana ny ahidy. Mampiasàny zezika organika mba hanalefahana ny tany.",
          timeframe: "Androany hatramin'ny talata",
          priority: 1
        },
        {
          icon: <FaWater className="text-cyan-600" />,
          title: "Fanamafisana ny fototry",
          description: "Ampio ny fototry ny zava-maniry mba hiarovana amin'ny rivotra sy hanalefahana ny fakany.",
          timeframe: "Herinandro manaraka",
          priority: 2
        }
      );
    }
    
    return advice.sort((a, b) => a.priority - b.priority).slice(0, 3);
  }, [currentWeather]);

  // GESTION DU CHARGEMENT
  if (loading) {
    return <WeatherSkeleton />;
  }

  // GESTION D'ERREUR
  if (error) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-b from-green-50 to-white md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="p-8 text-center bg-white border border-red-200 shadow-lg rounded-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-red-100 rounded-full">
              <span className="text-3xl">⚠️</span>
            </div>
            <h1 className="mb-4 text-2xl font-bold text-gray-900">Diso ny angona</h1>
            <p className="max-w-md mx-auto mb-6 text-gray-700">
              {error}. Mampiasa ny angona tazonina taloha. Andramo indray afaka fotoana fohy.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Andramo indray
            </button>
          </div>
        </div>
      </div>
    );
  }

  // VALIDATION DES DONNÉES
  if (!currentWeather || !dailyForecast?.length) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-green-50 to-white">
        <div className="text-center">
          <div className="mb-4 text-6xl">🌾</div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">Tsy misy angona mety</h2>
          <p className="text-gray-600">Mila hampiditra toerana hafa ianao na andramo indray</p>
        </div>
      </div>
    );
  }

  // Cast explicite pour les props
  const weather = currentWeather as unknown as CurrentWeather;
  const forecast = dailyForecast as unknown as ForecastDay[];
  const loc = location as unknown as Location;

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-green-50 to-white md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER AVEC MÉTADONNÉES */}
        <HeaderSection location={loc} />
        
        {/* CARTE PRINCIPALE DES CONDITIONS */}
        <CurrentWeatherSection 
          currentWeather={weather}
          windDirection={windDirection}
        />
        
        {/* PRÉVISIONS SUR 3 JOURS */}
        <ForecastSection dailyForecast={forecast} />
        
        {/* ALERTES ET CONSEILS */}
        <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-2">
          <AlertsSection alerts={alerts} />
          <AdviceSection advice={farmingAdvice} />
        </div>
        
        {/* INFORMATIONS COMPLÉMENTAIRES */}
        <AdditionalInfoSection 
          currentWeather={weather}
          dailyForecast={forecast}
        />
        
        {/* FOOTER */}
        <footer className="pt-8 mt-12 text-sm text-center text-gray-600 border-t border-green-200">
          <p>Angona avy amin'ny toetrandro • Nohavaozina tamin'ny {new Date().toLocaleTimeString('mg-MG', { hour: '2-digit', minute: '2-digit' })}</p>
          <p className="mt-2">Tohana ho an'ny tantsaha • V1.2.0</p>
        </footer>
      </div>
    </div>
  );
};

// SOUS-COMPOSANTS EXTRACTED

interface HeaderSectionProps {
  location: Location;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ location }) => (
  <header className="mb-8 md:mb-12">
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900 md:text-4xl">
          <span className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
            <span className="text-2xl">🌾</span>
          </span>
          Dashboard <span className="text-green-700">Tantsaha</span>
        </h1>
        <p className="mt-2 text-gray-600">Torolalana mety amin'ny asa fambolena</p>
      </div>
      
      {location && (
        <div className="flex flex-col md:items-end">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-lg font-bold text-gray-900">{location.name}</span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-gray-600">{location.region}</span>
            <time 
              className="px-4 py-2 font-medium text-green-800 bg-white border border-green-200 rounded-lg shadow-sm"
              dateTime={new Date().toISOString()}
            >
              {new Date().toLocaleDateString('mg-MG', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long',
                year: 'numeric'
              })}
            </time>
          </div>
        </div>
      )}
    </div>
  </header>
);

interface CurrentWeatherSectionProps {
  currentWeather: CurrentWeather;
  windDirection: { symbol: string; label: string };
}

const CurrentWeatherSection: React.FC<CurrentWeatherSectionProps> = ({ currentWeather, windDirection }) => (
  <section className="mb-8">
    <div className="overflow-hidden bg-white border border-green-100 shadow-xl rounded-2xl">
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* COLONNE GAUCHE - TEMPÉRATURE */}
          <div className="lg:col-span-1">
            <div className="flex flex-col h-full">
              <div className="mb-6">
                <h2 className="mb-4 text-sm font-semibold tracking-wider text-gray-500 uppercase">
                  Toetrandro ankehitriny
                </h2>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-gray-900 text-7xl md:text-8xl">
                    {currentWeather.temp_c}
                  </span>
                  <span className="text-2xl text-gray-600">°C</span>
                </div>
                <p className="mt-2 text-gray-600">
                  T° ressentie: <span className="font-semibold">{currentWeather.feelslike_c}°C</span>
                </p>
              </div>
              
              <div className="mt-auto">
                <div className="flex items-center gap-4">
                  <img 
                    src={`https:${currentWeather.condition.icon.replace('64x64', '128x128')}`}
                    alt={currentWeather.condition.text}
                    className="w-20 h-20"
                    width="80"
                    height="80"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-xl font-semibold text-gray-900 capitalize">
                      {currentWeather.condition.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Mise à jour à l'instant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* COLONNES DROITES - MÉTRICS */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <MetricCard
                icon={<FaWind className="text-blue-600" />}
                label="Rivotra"
                value={`${currentWeather.wind_kph} km/h`}
                description={`${windDirection.symbol} ${windDirection.label}`}
                trend={currentWeather.wind_kph > 15 ? "up" : "stable"}
              />
              
              <MetricCard
                icon={<WiHumidity className="text-2xl text-cyan-600" />}
                label="Hamandoana"
                value={`${currentWeather.humidity}%`}
                description={
                  currentWeather.humidity > 80 ? "Be loatra" : 
                  currentWeather.humidity < 30 ? "Maina" : "Tsara"
                }
                trend={currentWeather.humidity > 70 ? "up" : "stable"}
              />
              
              <MetricCard
                icon={<WiRaindrop className="text-2xl text-indigo-600" />}
                label="Rotsak'orana"
                value={`${currentWeather.precip_mm} mm`}
                description={
                  currentWeather.precip_mm > 5 ? "Be" : 
                  currentWeather.precip_mm > 0.5 ? "Kely" : "Tsy misy"
                }
                trend={currentWeather.precip_mm > 2 ? "up" : "stable"}
              />
              
              <MetricCard
                icon={<WiBarometer className="text-2xl text-purple-600" />}
                label="Fananterana"
                value={`${currentWeather.pressure_mb} hPa`}
                description={currentWeather.pressure_mb > 1013 ? "Avony" : "Ambany"}
                trend="stable"
              />
              
              <MetricCard
                icon={<FaSolarPanel className="text-amber-600" />}
                label="Indrisy UV"
                value={currentWeather.uv.toFixed(1)}
                description={
                  currentWeather.uv >= 8 ? "Tafahoatra ⚠️" :
                  currentWeather.uv >= 6 ? "Avony" :
                  currentWeather.uv >= 3 ? "Antonony" : "Ambany"
                }
                trend={currentWeather.uv > 6 ? "up" : "stable"}
              />
              
              <MetricCard
                icon={<FaThermometerHalf className="text-red-500" />}
                label="Hafanana"
                value={`${currentWeather.temp_c}°C`}
                description={
                  currentWeather.temp_c > 30 ? "Mafana" : 
                  currentWeather.temp_c < 15 ? "Mangatsiaka" : "Tsara"
                }
                trend={currentWeather.temp_c > 28 ? "up" : "stable"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

interface ForecastSectionProps {
  dailyForecast: ForecastDay[];
}

const ForecastSection: React.FC<ForecastSectionProps> = ({ dailyForecast }) => (
  <section className="mb-8">
    <div className="p-6 bg-white border border-blue-100 shadow-lg rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <FaCloudRain className="text-blue-600" />
          </div>
          Toetrandro ho avy 3 andro
        </h2>
        <span className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded-full">
          {CONFIG.FORECAST_DAYS} andro
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {dailyForecast.slice(0, 3).map((day, index) => (
          <ForecastCard 
            key={day.date}
            day={day}
            isToday={index === 0}
          />
        ))}
      </div>
    </div>
  </section>
);

interface AlertsSectionProps {
  alerts: AlertData[];
}

const AlertsSection: React.FC<AlertsSectionProps> = ({ alerts }) => (
  <section>
    <div className="h-full p-6 bg-white border border-orange-100 shadow-lg rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-3 text-xl font-bold text-gray-900">
          <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
            <span className="text-xl">⚠️</span>
          </div>
          Fampandrenesana
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          alerts.length > 0 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {alerts.length > 0 ? `${alerts.length} fampandrenesana` : 'Tsy misy'}
        </span>
      </div>
      
      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <AlertCard 
              key={index}
              {...alert}
            />
          ))
        ) : (
          <div className="py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-green-100 rounded-full">
              <span className="text-2xl">✅</span>
            </div>
            <p className="font-medium text-gray-900">Tsy misy fampandrenesana maika</p>
            <p className="mt-1 text-sm text-gray-600">Toetrandro mety amin'ny asa fambolena</p>
          </div>
        )}
      </div>
    </div>
  </section>
);

interface AdviceSectionProps {
  advice: AdviceData[];
}

const AdviceSection: React.FC<AdviceSectionProps> = ({ advice }) => (
  <section>
    <div className="h-full p-6 bg-white border shadow-lg rounded-2xl border-emerald-100">
      <h3 className="flex items-center gap-3 mb-6 text-xl font-bold text-gray-900">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100">
          <FaLeaf className="text-emerald-600" />
        </div>
        Torolalana momba ny fambolena
      </h3>
      
      <div className="space-y-4">
        {advice.map((item, index) => (
          <AdviceCard 
            key={index}
            {...item}
            index={index}
          />
        ))}
      </div>
    </div>
  </section>
);

interface AdditionalInfoSectionProps {
  currentWeather: CurrentWeather;
  dailyForecast: ForecastDay[];
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({ 
  currentWeather, 
  dailyForecast 
}) => (
  <section className="mt-8">
    <div className="p-6 border border-green-200 bg-gradient-to-r from-green-50 to-cyan-50 rounded-2xl">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <InfoCard
          icon={<FaSun className="text-amber-600" />}
          title="Lever masoandro"
          value={dailyForecast[0]?.astro?.sunrise || '06:00'}
          description="Maraina"
        />
        
        <InfoCard
          icon={<FaMoon className="text-indigo-600" />}
          title="Filentehan'ny masoandro"
          value={dailyForecast[0]?.astro?.sunset || '18:00'}
          description="Hariva"
        />
        
        <InfoCard
          icon={<FaCompressAlt className="text-purple-600" />}
          title="Halan'ny rivotra"
          value={`${currentWeather.gust_kph || 0} km/h`}
          description="Rivotra tampoka"
        />
        
        <InfoCard
          icon={<FaTint className="text-blue-600" />}
          title="Hamandoan'ny tany"
          value="Tsara"
          description="Araka ny fepetra"
        />
      </div>
    </div>
  </section>
);

// COMPOSANTS DE BAS NIVEAU

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, description, trend }) => (
  <div className="p-4 transition-all duration-200 border border-gray-200 bg-gray-50 rounded-xl hover:bg-white hover:border-green-300 hover:shadow-md">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="text-xl">{icon}</div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className={`w-2 h-2 rounded-full ${
        trend === 'up' ? 'bg-red-500' :
        trend === 'down' ? 'bg-blue-500' : 'bg-gray-400'
      }`}></div>
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="mt-2 text-sm text-gray-600">{description}</div>
  </div>
);

interface ForecastCardProps {
  day: ForecastDay;
  isToday: boolean;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ day, isToday }) => (
  <div className={`p-5 rounded-xl border ${isToday ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}`}>
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-lg font-bold text-gray-900">
          {new Date(day.date).toLocaleDateString('mg-MG', { weekday: 'short' })}
        </p>
        <p className="text-sm text-gray-600">
          {new Date(day.date).toLocaleDateString('mg-MG', { day: 'numeric', month: 'short' })}
          {isToday && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Androany</span>}
        </p>
      </div>
      <img 
        src={`https:${day.day.condition.icon}`}
        alt={day.day.condition.text}
        className="w-14 h-14"
        width="56"
        height="56"
        loading="lazy"
      />
    </div>
    
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-gray-900">{day.day.avgtemp_c}°</span>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1">
            <span className="font-bold text-red-600">{day.day.maxtemp_c}°</span>
            <span className="text-gray-400">/</span>
            <span className="font-bold text-blue-600">{day.day.mintemp_c}°</span>
          </div>
          <p className="mt-1 text-sm text-gray-700 capitalize">{day.day.condition.text}</p>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="font-bold text-gray-900">{day.day.daily_chance_of_rain}%</div>
            <div className="text-xs text-gray-600">Metaky orana</div>
          </div>
          <div>
            <div className="font-bold text-gray-900">{day.day.maxwind_kph} km/h</div>
            <div className="text-xs text-gray-600">Rivotra</div>
          </div>
          <div>
            <div className="font-bold text-gray-900">{day.day.avghumidity}%</div>
            <div className="text-xs text-gray-600">Hamandoana</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

interface AlertCardProps {
  type: 'high' | 'rain' | 'wind' | 'temp';
  title: string;
  message: string;
  icon: string;
  severity: 'high' | 'medium' | 'low';
}

const AlertCard: React.FC<AlertCardProps> = ({ type, title, message, icon, severity }) => {
  const config = {
    high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', iconBg: 'bg-red-100' },
    rain: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', iconBg: 'bg-blue-100' },
    wind: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', iconBg: 'bg-amber-100' },
    temp: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', iconBg: 'bg-orange-100' }
  }[type];

  return (
    <div className={`p-4 rounded-lg border ${config.bg} ${config.border} flex items-start gap-3`}>
      <div className={`w-10 h-10 rounded-lg ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold text-gray-900">{title}</h4>
          <span className={`px-2 py-0.5 text-xs rounded-full ${
            severity === 'high' ? 'bg-red-100 text-red-800' :
            severity === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {severity === 'high' ? 'Maika' : 'Antonony'}
          </span>
        </div>
        <p className="text-sm text-gray-700">{message}</p>
      </div>
    </div>
  );
};

interface AdviceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  timeframe: string;
  index: number;
}

const AdviceCard: React.FC<AdviceCardProps> = ({ icon, title, description, timeframe, index }) => (
  <div className="p-4 transition-all duration-200 bg-white border border-emerald-100 rounded-xl hover:border-emerald-300 hover:shadow-sm">
    <div className="flex items-start gap-3">
      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-50">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-gray-900">{title}</h4>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
            #{index + 1}
          </span>
        </div>
        <p className="mb-3 text-sm text-gray-600">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-emerald-700">{timeframe}</span>
          <span className="text-xs text-gray-500">Tantsaha</span>
        </div>
      </div>
    </div>
  </div>
);

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, value, description }) => (
  <div className="p-4 text-center bg-white border border-green-100 rounded-xl">
    <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-green-100 rounded-lg">
      <div className="text-xl">{icon}</div>
    </div>
    <h4 className="font-medium text-gray-900">{title}</h4>
    <div className="my-2 text-2xl font-bold text-gray-900">{value}</div>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const WeatherSkeleton: React.FC = () => (
  <div className="min-h-screen p-4 bg-gradient-to-b from-green-50 to-white md:p-8">
    <div className="max-w-6xl mx-auto">
      {/* Squelette pour l'en-tête */}
      <div className="mb-8">
        <div className="w-1/3 h-10 mb-4 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="w-1/4 h-6 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      {/* Squelette pour la carte principale */}
      <div className="p-8 mb-8 bg-white border border-green-100 shadow-lg rounded-2xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="h-24 mb-4 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Squelette pour les prévisions */}
      <div className="p-6 mb-8 bg-white border border-blue-100 shadow-lg rounded-2xl">
        <div className="w-1/4 h-8 mb-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
      
      {/* Squelette pour les alertes et conseils */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default HomePage;