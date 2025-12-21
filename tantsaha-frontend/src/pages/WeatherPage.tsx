 // src/pages/WeatherPage.tsx
import React, { useState, useEffect } from 'react';
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
  FaUmbrella,
  FaEye,
  FaArrowUp,
  FaArrowDown,
  FaThermometerEmpty,
  FaThermometerFull,
  FaCompass,
  FaCloud,
  FaBolt,
  FaSnowflake
} from 'react-icons/fa';
import { WiBarometer, WiHumidity, WiRaindrop, WiStrongWind } from 'react-icons/wi';

const WeatherPage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('Antananarivo');
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'hourly' | 'maps'>('today');
  const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
  
  // Récupérer les données avec plus de jours pour les prévisions détaillées
  const { currentWeather, dailyForecast, loading, error, location, setCity } = useWeather(selectedCity, 7);

  const malagasyCities = [
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

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setCity(city);
  };

  // Fonction pour convertir la température
  const convertTemp = (tempC: number): number => {
    return temperatureUnit === 'C' ? tempC : (tempC * 9/5) + 32;
  };

  if (loading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50">
      {/* Header avec sélecteur de ville */}
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
                    {new Date().toLocaleDateString('mg-MG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Sélecteur de ville */}
              <div className="relative">
                <FaSearch className="absolute text-gray-400 left-3 top-3" />
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 bg-white border border-gray-300 rounded-lg sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {malagasyCities.map(city => (
                    <option key={city.name} value={city.name}>
                      {city.name} ({city.region})
                    </option>
                  ))}
                </select>
              </div>

              {/* Switch température */}
              <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setTemperatureUnit('C')}
                  className={`px-3 py-1 rounded-md transition-all ${temperatureUnit === 'C' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                  °C
                </button>
                <button
                  onClick={() => setTemperatureUnit('F')}
                  className={`px-3 py-1 rounded-md transition-all ${temperatureUnit === 'F' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                  °F
                </button>
              </div>
            </div>
          </div>

          {/* Navigation par onglets */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="flex space-x-2 overflow-x-auto">
              {['today', 'week', 'hourly', 'maps'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 whitespace-nowrap rounded-t-lg transition-all ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {tab === 'today' && 'Androany'}
                  {tab === 'week' && 'Herinandro'}
                  {tab === 'hourly' && 'Isa-orana'}
                  {tab === 'maps' && 'Sarin\'ny toetrandro'}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container p-4 mx-auto md:p-6">
        {error && (
          <div className="p-4 mb-6 border border-yellow-200 bg-yellow-50 rounded-xl">
            <p className="text-yellow-800">⚠️ {error}</p>
          </div>
        )}

        {/* Section météo actuelle (toujours visible) */}
        {currentWeather && (
          <div className="mb-8">
            <div className="overflow-hidden shadow-xl bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl">
              <div className="p-6 text-white md:p-8">
                <div className="flex flex-col items-center justify-between lg:flex-row">
                  <div className="mb-6 text-center lg:text-left lg:mb-0">
                    <div className="flex items-center justify-center mb-4 lg:justify-start">
                      <img 
                        src={`https:${currentWeather.condition.icon.replace('64x64', '128x128')}`}
                        alt={currentWeather.condition.text}
                        className="w-24 h-24 filter drop-shadow-lg"
                      />
                      <div className="ml-6">
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
                      value={`${currentWeather.humidity}%`}
                      description={currentWeather.humidity > 80 ? "Be" : "Ara-dalàna"}
                    />
                    <WeatherMetric 
                      icon={<WiStrongWind className="text-2xl" />}
                      label="Rivotra"
                      value={`${currentWeather.wind_kph} km/h`}
                      description={currentWeather.wind_dir}
                    />
                    <WeatherMetric 
                      icon={<WiRaindrop className="text-2xl" />}
                      label="Rotsak'orana"
                      value={`${currentWeather.precip_mm} mm`}
                      description={currentWeather.precip_mm > 5 ? "Be" : "Tsy misy"}
                    />
                    <WeatherMetric 
                      icon={<FaEye className="text-xl" />}
                      label="Fahitana"
                      value="10 km"
                      description="Tsara"
                    />
                    <WeatherMetric 
                      icon={<WiBarometer className="text-2xl" />}
                      label="Fananterana"
                      value={`${currentWeather.pressure_mb} hPa`}
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

        {/* Contenu selon l'onglet actif */}
        <div className="mt-8">
          {activeTab === 'today' && currentWeather && dailyForecast[0] && (
            <TodayTab currentWeather={currentWeather} todayForecast={dailyForecast[0]} convertTemp={convertTemp} unit={temperatureUnit} />
          )}

          {activeTab === 'week' && dailyForecast.length > 0 && (
            <WeekTab forecast={dailyForecast} convertTemp={convertTemp} unit={temperatureUnit} />
          )}

          {activeTab === 'hourly' && dailyForecast[0]?.hour && (
            <HourlyTab hourlyData={dailyForecast[0].hour} convertTemp={convertTemp} unit={temperatureUnit} />
          )}

          {activeTab === 'maps' && (
            <MapsTab selectedCity={selectedCity} />
          )}
        </div>

        {/* Conseils agricoles */}
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
                icon={<FaThermometerHalf />}
              />
              <AgriculturalAdvice 
                condition="rain"
                value={currentWeather.precip_mm}
                title="Rotsak'orana"
                advice={currentWeather.precip_mm > 10 ? "Orana be - Aza mamoaka zezika na fanafody" : 
                       currentWeather.precip_mm > 2 ? "Andro tsara handondrahana rano" : 
                       "Maina - Ilaina ny fanondrahana rano"}
                icon={<FaCloudRain />}
              />
              <AgriculturalAdvice 
                condition="uv"
                value={currentWeather.uv}
                title="Indrisy UV"
                advice={currentWeather.uv >= 8 ? "Tafahoatra - Mampiasa solon-tanana sy satroka" : 
                       currentWeather.uv >= 5 ? "Avony - Aza miasa ela eo amin'ny masoandro" : 
                       "Ambany - Andro tsara hanaovana asa ivelany"}
                icon={<FaSun />}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant pour les métriques
const WeatherMetric: React.FC<{ icon: React.ReactNode; label: string; value: string; description: string }> = ({ 
  icon, label, value, description 
}) => (
  <div className="p-3 text-center">
    <div className="flex justify-center mb-2 text-2xl">{icon}</div>
    <div className="text-sm opacity-90">{label}</div>
    <div className="text-xl font-bold">{value}</div>
    <div className="text-xs opacity-80">{description}</div>
  </div>
);

// Onglet "Aujourd'hui"
const TodayTab: React.FC<{ currentWeather: any; todayForecast: any; convertTemp: (temp: number) => number; unit: string }> = ({ 
  currentWeather, todayForecast, convertTemp, unit 
}) => (
  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
    {/* Lever/coucher du soleil */}
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
              <div className="text-gray-600">{todayForecast.astro.sunrise}</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-yellow-600">6:20</div>
        </div>
        <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl">
          <div className="flex items-center">
            <FaMoon className="mr-4 text-2xl text-indigo-500" />
            <div>
              <div className="font-bold text-gray-800">Masoandro milentika</div>
              <div className="text-gray-600">{todayForecast.astro.sunset}</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-600">18:45</div>
        </div>
      </div>
    </div>

    {/* Prévisions par période */}
    <div className="p-6 bg-white shadow-lg rounded-2xl">
      <h3 className="mb-6 text-xl font-bold text-gray-800">Toetrandro isan'ora</h3>
      <div className="grid grid-cols-4 gap-3">
        {['Matinina', 'Tolak\'andro', 'Hariva', 'Alina'].map((period, idx) => (
          <div key={idx} className="p-3 text-center border border-gray-200 rounded-lg">
            <div className="font-bold text-gray-800">{period}</div>
            <div className="my-2 text-2xl font-bold text-blue-600">
              {convertTemp(currentWeather.temp_c + (idx - 1.5)).toFixed(0)}°{unit}
            </div>
            <img 
              src={`https:${currentWeather.condition.icon}`}
              alt={currentWeather.condition.text}
              className="w-10 h-10 mx-auto"
            />
            <div className="mt-1 text-sm text-gray-600">{currentWeather.condition.text}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Onglet "Semaine"
const WeekTab: React.FC<{ forecast: any[]; convertTemp: (temp: number) => number; unit: string }> = ({ 
  forecast, convertTemp, unit 
}) => (
  <div className="overflow-hidden bg-white shadow-lg rounded-2xl">
    <div className="p-6">
      <h3 className="mb-6 text-xl font-bold text-gray-800">Toetrandro 7 andro</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-gray-600">Andro</th>
              <th className="px-4 py-3 text-center text-gray-600">Sary</th>
              <th className="px-4 py-3 text-center text-gray-600">Maripana</th>
              <th className="px-4 py-3 text-center text-gray-600">Rivotra</th>
              <th className="px-4 py-3 text-center text-gray-600">Orana</th>
              <th className="px-4 py-3 text-center text-gray-600">Hamandoana</th>
            </tr>
          </thead>
          <tbody>
            {forecast.map((day, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="font-bold text-gray-800">
                    {new Date(day.date).toLocaleDateString('mg-MG', { weekday: 'long' })}
                  </div>
                  <div className="text-sm text-gray-600">{day.date}</div>
                </td>
                <td className="px-4 py-4 text-center">
                  <img 
                    src={`https:${day.day.condition.icon}`}
                    alt={day.day.condition.text}
                    className="w-12 h-12 mx-auto"
                  />
                  <div className="text-xs text-gray-600 capitalize">{day.day.condition.text}</div>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center space-x-2">
                      <FaArrowUp className="text-red-500" />
                      <span className="font-bold text-gray-800">{convertTemp(day.day.maxtemp_c).toFixed(0)}°{unit}</span>
                    </div>
                    <div className="flex items-center mt-1 space-x-2">
                      <FaArrowDown className="text-blue-500" />
                      <span className="font-bold text-gray-800">{convertTemp(day.day.mintemp_c).toFixed(0)}°{unit}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <FaWind className="mr-2 text-gray-500" />
                    <span className="font-bold text-gray-800">{day.day.maxwind_kph} km/h</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className={`px-3 py-1 rounded-full ${day.day.daily_chance_of_rain > 50 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {day.day.daily_chance_of_rain}%
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <FaTint className="mr-2 text-blue-400" />
                    <span className="font-bold text-gray-800">{day.day.avghumidity}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Onglet "Heure par heure"
const HourlyTab: React.FC<{ hourlyData: any[]; convertTemp: (temp: number) => number; unit: string }> = ({ 
  hourlyData, convertTemp, unit 
}) => (
  <div className="p-6 bg-white shadow-lg rounded-2xl">
    <h3 className="mb-6 text-xl font-bold text-gray-800">Toetrandro isa-orana</h3>
    <div className="flex pb-6 space-x-4 overflow-x-auto">
      {hourlyData.slice(0, 24).map((hour, index) => (
        <div key={index} className="flex-shrink-0 w-24 p-3 text-center border border-gray-200 rounded-xl">
          <div className="font-bold text-gray-800">{hour.time.split(' ')[1]}</div>
          <img 
            src={`https:${hour.condition.icon}`}
            alt={hour.condition.text}
            className="w-10 h-10 mx-auto my-2"
          />
          <div className="text-xl font-bold text-gray-800">{convertTemp(hour.temp_c).toFixed(0)}°{unit}</div>
          <div className="text-sm text-gray-600 capitalize">{hour.condition.text}</div>
          <div className="flex items-center justify-center mt-2">
            <FaCloudRain className="mr-1 text-blue-400" />
            <span className="text-xs">{hour.chance_of_rain}%</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Onglet "Cartes" (version simplifiée)
const MapsTab: React.FC<{ selectedCity: string }> = ({ selectedCity }) => (
  <div className="p-6 bg-white shadow-lg rounded-2xl">
    <h3 className="mb-6 text-xl font-bold text-gray-800">Sarin'ny toetrandro eto Madagasikara</h3>
    <div className="flex items-center justify-center border border-gray-300 aspect-video bg-gradient-to-br from-blue-100 to-green-100 rounded-xl">
      <div className="text-center">
        <FaMapMarkerAlt className="mx-auto mb-4 text-4xl text-red-500" />
        <p className="font-bold text-gray-700">{selectedCity}</p>
        <p className="text-gray-600">Kaonty fandraisana sarintany ho avy...</p>
        <button className="px-4 py-2 mt-4 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
          Hijery sarintany feno
        </button>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-4">
      {['Tendron\'i Nosy', 'Afovoan-tany', 'Atsinanana', 'Andrefana'].map((region, idx) => (
        <div key={idx} className="p-4 text-center border border-gray-200 rounded-lg">
          <div className="font-bold text-gray-800">{region}</div>
          <div className="my-2 text-2xl font-bold text-blue-600">25°C</div>
          <div className="text-sm text-gray-600">Tsara ny toetrandro</div>
        </div>
      ))}
    </div>
  </div>
);

// Composant conseil agricole
const AgriculturalAdvice: React.FC<{ 
  condition: string; 
  value: number; 
  title: string; 
  advice: string; 
  icon: React.ReactNode 
}> = ({ condition, value, title, advice, icon }) => {
  const getColor = () => {
    switch(condition) {
      case 'temperature':
        return value > 30 ? 'bg-red-50 border-red-200' : 
               value < 15 ? 'bg-blue-50 border-blue-200' : 
               'bg-green-50 border-green-200';
      case 'rain':
        return value > 10 ? 'bg-blue-50 border-blue-200' : 
               value > 2 ? 'bg-cyan-50 border-cyan-200' : 
               'bg-yellow-50 border-yellow-200';
      case 'uv':
        return value >= 8 ? 'bg-orange-50 border-orange-200' : 
               value >= 5 ? 'bg-yellow-50 border-yellow-200' : 
               'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`p-5 rounded-xl border ${getColor()} transition-transform hover:scale-[1.02]`}>
      <div className="flex items-center mb-3">
        <div className="p-2 bg-white rounded-full shadow-sm">
          {icon}
        </div>
        <div className="ml-3">
          <h4 className="font-bold text-gray-800">{title}</h4>
          <p className="text-2xl font-bold text-gray-900">{value}{condition === 'temperature' ? '°C' : condition === 'uv' ? '' : 'mm'}</p>
        </div>
      </div>
      <p className="text-gray-700">{advice}</p>
    </div>
  );
};

export default WeatherPage;