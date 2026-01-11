import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { number } from 'framer-motion';

// 1. Les données des villes (on peut les mettre ici pour l'instant)
 const MADAGASCAR_CITIES = [
  { 
    name: "Antananarivo", 
    coordinates: [-18.8792, 47.5079], 
    temp: 22, 
    region: "Analamanga" 
  },
  { 
    name: "Toamasina", 
    coordinates: [-18.1492, 49.4023], 
    temp: 26, 
    region: "Atsinanana" 
  },
  { 
    name: "Mahajanga", 
    coordinates: [-15.7167, 46.3167], 
    temp: 31, 
    region: "Boeny" 
  }
];

 const createWeatherIcon = (temp: number) => {
  // Définition de la couleur selon la température 🌡️
  const color = temp >= 30 ? '#ef4444' : temp >= 20 ? '#fb923c' : '#3b82f6';

  return L.divIcon({
    className: "custom-icon",
    html: `<div style="background-color: ${color};" 
               class="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[10px] text-white font-bold">
            ${temp}
          </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export default function WeatherMap() {
  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-lg">
       <MapContainer center={[-18.7669, 46.8691]} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
        />
  
  {/* On insère la boucle ici */}
  {MADAGASCAR_CITIES.map((city) => (
  <Marker 
    key={city.name} 
    position={city.coordinates as [number, number]}
    icon={createWeatherIcon(city.temp)} // On appelle notre fonction ici ! 🎨
  >
    <Popup>
      <div className="text-center">
        <p className="font-bold">{city.name}</p>
        <p className="text-sm">{city.region}</p>
        <p className="font-semibold text-blue-600">{city.temp}°C</p>
      </div>
    </Popup>
  </Marker>
  ))}
</MapContainer>
    </div>
  );
}