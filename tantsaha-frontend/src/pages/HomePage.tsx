 // src/pages/HomePage.tsx
import React from 'react';
import { useWeather } from '../hooks/useWeather'; // 1. Importez le hook

const HomePage: React.FC = () => {
  // 2. Utilisez le hook pour récupérer les données
  const { currentWeather, dailyForecast, loading, error } = useWeather('Antananarivo');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de Bord - Trano</h1>
      
      {/* 3. Affichez un aperçu météo */}
      <div className="p-6 bg-white shadow-md rounded-xl">
        <h2 className="mb-4 text-xl font-semibold">Toetrandro ankehitriny</h2>
        
        {loading && <p>Mampakatra ny toetrandro...</p>}
        {error && <p className="text-red-500">Tsy nahomby ny fampakatra: {error}</p>}
        
        {currentWeather && (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-5xl font-bold">{currentWeather.temp_c}°C</div>
              <p className="text-gray-600 capitalize">{currentWeather.condition.text}</p>
              <p className="text-sm">T° ressentie: {currentWeather.feelslike_c}°C • Hamandoana: {currentWeather.humidity}%</p>
            </div>
            <div>
              <img 
                src={`https:${currentWeather.condition.icon}`} 
                alt={currentWeather.condition.text}
                className="w-20 h-20"
              />
            </div>
          </div>
        )}
        
        {/* Aperçu des 2 prochains jours */}
        {dailyForecast.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-6">
            {dailyForecast.slice(0, 2).map((day, index) => (
              <div key={index} className="p-3 text-center rounded bg-blue-50">
                <p className="font-medium">
                  {new Date(day.date).toLocaleDateString('fr-MG', { weekday: 'short' })}
                </p>
                <img 
                  src={`https:${day.day.condition.icon}`} 
                  alt={day.day.condition.text}
                  className="w-10 h-10 mx-auto"
                />
                <p className="text-sm">{day.day.condition.text}</p>
                <p className="text-sm">
                  <span className="text-blue-600">{day.day.maxtemp_c}°</span> / 
                  <span className="text-gray-600"> {day.day.mintemp_c}°</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Le reste de votre contenu pour le tableau de bord (alertes, conseils, etc.) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Section Alertes */}
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="mb-2 text-lg font-bold">Fampandrenesana</h3>
          {/* Ici, vous intégrerez les alertes plus tard */}
        </div>
        
        {/* Section Activités récentes */}
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="mb-2 text-lg font-bold">Asa vao haingana</h3>
          {/* Ici, vous intégrerez le journal agricole plus tard */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;