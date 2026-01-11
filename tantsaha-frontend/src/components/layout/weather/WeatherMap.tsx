import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// 1. Les données des villes (on peut les mettre ici pour l'instant)
const MADAGASCAR_CITIES = [
  { name: "Antananarivo", coords: [-18.8792, 47.5079], temp: 22 },
  { name: "Toamasina", coords: [-18.1492, 49.4023], temp: 26 },
  { name: "Mahajanga", coords: [-15.7167, 46.3167], temp: 31 },
];

export default function WeatherMap() {
  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-lg">
      <MapContainer center={[-18.7669, 46.8691]} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {/* C'est ici que nous allons afficher les points sur la carte */}
        
      </MapContainer>
    </div>
  );
}