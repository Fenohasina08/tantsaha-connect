 import React from 'react';
import { useWeather } from '../hooks/useWeather';
import { 
  FaWind, 
  FaTint, 
  FaCloudRain, 
  FaSun, 
  FaMoon, 
  FaThermometerHalf,
  FaCompressAlt,
  FaSolarPanel
} from 'react-icons/fa';

const HomePage: React.FC = () => {
  const { currentWeather, dailyForecast, loading, error, location } = useWeather('Antananarivo', 3);

  // Fonction MODIFIÉE : Accepte les degrés OU la direction
  const getWindDirectionIcon = (windData: number | string) => {
    if (typeof windData === 'string') {
      // Si c'est une chaîne (wind_dir), convertir en degrés approximatifs
      const dirMap: Record<string, number> = {
        'N': 0, 'NNE': 22.5, 'NE': 45, 'ENE': 67.5,
        'E': 90, 'ESE': 112.5, 'SE': 135, 'SSE': 157.5,
        'S': 180, 'SSW': 202.5, 'SW': 225, 'WSW': 247.5,
        'W': 270, 'WNW': 292.5, 'NW': 315, 'NNW': 337.5
      };
      const deg = dirMap[windData.toUpperCase()] || 0;
      const directions = ['↓ N', '↘ NE', '→ E', '↗ SE', '↑ S', '↖ SO', '← O', '↙ NO'];
      return directions[Math.round(deg / 45) % 8];
    } else {
      // Si c'est un nombre (wind_degree)
      const directions = ['↓ N', '↘ NE', '→ E', '↗ SE', '↑ S', '↖ SO', '← O', '↙ NO'];
      return directions[Math.round(windData / 45) % 8];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-green-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Mampakatra ny toetrandro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8 md:p-6">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">
          🌾 Tableau de Bord <span className="text-green-600">Tantsaha</span>
        </h1>
        {location && (
          <p className="mt-2 text-gray-600">
            <span className="font-medium">{location.name}</span>, {location.region} • 
            <span className="px-2 py-1 ml-2 text-sm text-green-800 bg-green-100 rounded">
              {new Date().toLocaleDateString('mg-MG', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </p>
        )}
      </div>

      {error ? (
        <div className="p-6 border border-yellow-200 bg-yellow-50 rounded-xl">
          <p className="text-yellow-800">⚠️ {error}. Mampiasa ny angona tazonina.</p>
        </div>
      ) : currentWeather && (
        <div className="overflow-hidden border border-green-100 shadow-lg bg-gradient-to-br from-white to-green-50 rounded-2xl">
          <div className="p-6 md:p-8">
            <div className="flex flex-col justify-between md:flex-row md:items-center">
              <div className="mb-6 md:mb-0 md:flex-1">
                <div className="flex items-start">
                  <div>
                    <div className="text-6xl font-bold text-gray-800 md:text-7xl">
                      {currentWeather.temp_c}°<span className="text-4xl text-gray-600">C</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <img 
                        src={`https:${currentWeather.condition.icon.replace('64x64', '128x128')}`}
                        alt={currentWeather.condition.text}
                        className="w-16 h-16"
                      />
                      <div className="ml-4">
                        <p className="text-xl font-semibold text-gray-700 capitalize">
                          {currentWeather.condition.text}
                        </p>
                        <p className="text-gray-600">
                          T° ressentie: <span className="font-medium">{currentWeather.feelslike_c}°C</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:w-2/3">
                {/* CORRECTION ICI : Utilisation de wind_degree */}
                <WeatherDataCard 
                  icon={<FaWind className="text-blue-500" />}
                  label="Rivotra"
                  value={`${currentWeather.wind_kph} km/h`}
                  subValue={getWindDirectionIcon(currentWeather.wind_degree || currentWeather.wind_dir || 0)}
                />
                <WeatherDataCard 
                  icon={<FaTint className="text-cyan-500" />}
                  label="Hamandoana"
                  value={`${currentWeather.humidity}%`}
                  subValue={currentWeather.humidity > 80 ? "Be loatra" : currentWeather.humidity < 30 ? "Maina" : "Ara-dalàna"}
                />
                <WeatherDataCard 
                  icon={<FaCloudRain className="text-indigo-500" />}
                  label="Rotsak'orana"
                  value={`${currentWeather.precip_mm} mm`}
                  subValue={currentWeather.precip_mm > 5 ? "Be" : "Kely"}
                />
                <WeatherDataCard 
                  icon={<FaCompressAlt className="text-purple-500" />}
                  label="Fananterana"
                  value={`${currentWeather.pressure_mb} hPa`}
                  subValue={currentWeather.pressure_mb > 1013 ? "Avony" : "Ambany"}
                />
                <WeatherDataCard 
                  icon={<FaSolarPanel className="text-orange-500" />}
                  label="Indrisy UV"
                  value={currentWeather.uv.toFixed(1)}
                  subValue={
                    currentWeather.uv >= 8 ? "Tafahoatra" :
                    currentWeather.uv >= 6 ? "Avony" :
                    currentWeather.uv >= 3 ? "Antonony" : "Ambany"
                  }
                />
                <WeatherDataCard 
                  icon={<FaThermometerHalf className="text-red-400" />}
                  label="Hafanana"
                  value={`${currentWeather.temp_c}°C`}
                  subValue={currentWeather.temp_c > 30 ? "Mafana" : currentWeather.temp_c < 15 ? "Mangatsiaka" : "Mahafinaritra"}
                />
              </div>
            </div>

            {dailyForecast[0]?.astro && (
              <div className="pt-6 mt-8 border-t border-green-100">
                <h4 className="mb-3 font-medium text-gray-700">Masoko sy Filentehan'ny masoandro</h4>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <FaSun className="mr-2 text-yellow-500" />
                    <span className="font-medium">Lever: {dailyForecast[0].astro.sunrise}</span>
                  </div>
                  <div className="flex items-center">
                    <FaMoon className="mr-2 text-indigo-500" />
                    <span className="font-medium">Coucher: {dailyForecast[0].astro.sunset}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Le reste du code reste inchangé */}
      {dailyForecast.length > 0 && (
        <div className="p-6 bg-white shadow-lg rounded-2xl">
          <h2 className="flex items-center mb-6 text-2xl font-bold text-gray-800">
            <FaCloudRain className="mr-3 text-blue-500" />
            Toetrandro ho avy andro 3
          </h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {dailyForecast.slice(0, 3).map((day, index) => (
              <div 
                key={index} 
                className={`p-5 rounded-xl border ${index === 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-lg font-bold text-gray-800">
                      {new Date(day.date).toLocaleDateString('fr-MG', { weekday: 'long' })}
                    </p>
                    <p className="text-sm text-gray-600">{day.date}</p>
                  </div>
                  <img 
                    src={`https:${day.day.condition.icon}`}
                    alt={day.day.condition.text}
                    className="w-12 h-12"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-800">{day.day.avgtemp_c}°</span>
                    <div className="text-right">
                      <div className="flex items-center">
                        <span className="font-medium text-red-500">{day.day.maxtemp_c}°</span>
                        <span className="mx-1">/</span>
                        <span className="font-medium text-blue-500">{day.day.mintemp_c}°</span>
                      </div>
                      <p className="text-sm text-gray-600 capitalize">{day.day.condition.text}</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <div className="text-center">
                        <div className="font-medium text-gray-700">{day.day.daily_chance_of_rain}%</div>
                        <div className="text-gray-600">Metaky orana</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-700">{day.day.maxwind_kph} km/h</div>
                        <div className="text-gray-600">Rivotra</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-700">{day.day.avghumidity}%</div>
                        <div className="text-gray-600">Hamandoana</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="p-6 border border-orange-100 shadow-lg bg-gradient-to-br from-white to-orange-50 rounded-2xl">
          <h3 className="flex items-center mb-4 text-xl font-bold text-gray-800">
            <span className="w-3 h-3 mr-2 bg-red-500 rounded-full animate-pulse"></span>
            Fampandrenesana momba ny fambolena
          </h3>
          <div className="space-y-4">
            {currentWeather && (
              <>
                {currentWeather.uv >= 8 && (
                  <AlertItem 
                    type="high"
                    title="Indrisy UV tafahoatra"
                    message="Aza mivoaka eo amin'ny masoandro eo anelanelan'ny 10h sy 14h. Mampiasa solon-tanana sy satroka."
                  />
                )}
                {currentWeather.precip_mm > 10 && (
                  <AlertItem 
                    type="rain"
                    title="Rotsak'orana be miandry"
                    message="Aza manamboatra zava-maniry ankehitriny. Andraso ny tany ho maina."
                  />
                )}
                {currentWeather.wind_kph > 20 && (
                  <AlertItem 
                    type="wind"
                    title="Rivotra mahery"
                    message="Ary ampiaro ny zana-kazo vao teraka. Mety ho simba ny ravinkazo."
                  />
                )}
              </>
            )}
            {(!currentWeather || (currentWeather.uv < 8 && currentWeather.precip_mm <= 10 && currentWeather.wind_kph <= 20)) && (
              <div className="py-8 text-center text-gray-600">
                <p className="font-medium">Tsy misy fampandrenesana maika ankehitriny</p>
                <p className="mt-1 text-sm">Toetrandro mety amin'ny asa fambolena</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border shadow-lg bg-gradient-to-br from-white to-emerald-50 border-emerald-100 rounded-2xl">
          <h3 className="mb-4 text-xl font-bold text-gray-800">Torolalana ho an'ity herinandro ity</h3>
          <ul className="space-y-4">
            <AdviceItem 
              icon="🌱"
              title="Famafazana voa"
              description="Andro tsara hanafarana ny voa karoty, salady, tongolo."
              timeframe="Androany hatramin'ny alarobia"
            />
            <AdviceItem 
              icon="💧"
              title="Fandrarana rano"
              description="Andro mangatsiaka kokoa. Ampihenao ny fanondrahana rano."
              timeframe="Androany hatramin'ny sabotsy"
            />
            <AdviceItem 
              icon="🐛"
              title="Fikojakojana ny bibikely"
              description="Jereo ny ravinkazo raha misy bibikely. Mety ilaina ny fanafody raha be loatra."
              timeframe="Androany"
            />
          </ul>
        </div>
      </div>
    </div>
  );
};

interface WeatherDataCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue: string;
}

const WeatherDataCard: React.FC<WeatherDataCardProps> = ({ icon, label, value, subValue }) => (
  <div className="p-4 transition-shadow bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
    <div className="flex items-center mb-2">
      <div className="text-xl">{icon}</div>
      <span className="ml-2 text-sm font-medium text-gray-600">{label}</span>
    </div>
    <div className="text-xl font-bold text-gray-800">{value}</div>
    <div className="mt-1 text-xs text-gray-500">{subValue}</div>
  </div>
);

interface AlertItemProps {
  type: 'high' | 'rain' | 'wind';
  title: string;
  message: string;
}

const AlertItem: React.FC<AlertItemProps> = ({ type, title, message }) => {
  const colors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    rain: 'bg-blue-100 text-blue-800 border-blue-200',
    wind: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[type]}`}>
      <div className="font-bold">{title}</div>
      <div className="mt-1 text-sm">{message}</div>
    </div>
  );
};

interface AdviceItemProps {
  icon: string;
  title: string;
  description: string;
  timeframe: string;
}

const AdviceItem: React.FC<AdviceItemProps> = ({ icon, title, description, timeframe }) => (
  <li className="flex items-start p-3 transition-colors bg-white border rounded-lg border-emerald-50 hover:border-emerald-200">
    <div className="mr-4 text-2xl">{icon}</div>
    <div className="flex-1">
      <div className="font-bold text-gray-800">{title}</div>
      <div className="mt-1 text-sm text-gray-600">{description}</div>
      <div className="mt-2 text-xs font-medium text-emerald-600">{timeframe}</div>
    </div>
  </li>
);

export default HomePage;