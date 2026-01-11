 import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

// 1. Données des villes
const MADAGASCAR_CITIES = [
  { name: "Antananarivo", coordinates: [-18.8792, 47.5079], temp: 22, region: "Analamanga" },
  { name: "Toamasina", coordinates: [-18.1492, 49.4023], temp: 26, region: "Atsinanana" },
  { name: "Mahajanga", coordinates: [-15.7167, 46.3167], temp: 31, region: "Boeny" }
];

// 2. Fonction pour créer l'icône colorée 🎨
const createWeatherIcon = (temp: number) => {
  const color = temp >= 30 ? '#ef4444' : temp >= 20 ? '#fb923c' : '#3b82f6';
  return L.divIcon({
    className: "custom-icon",
    html: `<div style="background-color: ${color};" 
               class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[10px] text-white font-bold">
            ${temp}
          </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

// 3. Le contrôleur qui fait bouger la carte ✈️
function MapController({ selectedCoords }: { selectedCoords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (selectedCoords) {
      map.flyTo(selectedCoords, 10, { animate: true, duration: 1.5 });
    }
  }, [selectedCoords, map]);
  return null;
}

// 4. Le composant principal exporté
// On ajoute { selectedCoords } dans les arguments pour recevoir l'info du parent
export default function WeatherMap({ selectedCoords }: { selectedCoords: [number, number] | null }) {
  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-lg border-2 border-white/20">
      <MapContainer 
        center={[-18.7669, 46.8691]} 
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
        />

        {/* On active le contrôleur de mouvement */}
        <MapController selectedCoords={selectedCoords} />
  
        {/* Boucle d'affichage des marqueurs */}
        {MADAGASCAR_CITIES.map((city) => (
          <Marker 
            key={city.name} 
            position={city.coordinates as [number, number]}
            icon={createWeatherIcon(city.temp)}
          >
            <Popup>
              <div className="p-1 text-center">
                <p className="font-bold text-gray-800">{city.name}</p>
                <p className="text-xs text-gray-500">{city.region}</p>
                <p className="mt-1 font-bold text-blue-600">{city.temp}°C</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}