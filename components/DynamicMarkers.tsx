import { useEffect } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';

interface Spot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: {
    icon: string;
    name: string;
  };
  created: string;
}

interface DynamicMarkersProps {
  spots: Spot[];
  onSpotClick: (spot: Spot) => void;
}

const DynamicMarkers: React.FC<DynamicMarkersProps> = ({ spots, onSpotClick }) => {
  const map = useMap();

  useEffect(() => {
    const markerLayer = L.layerGroup().addTo(map);

    spots.forEach((spot) => {
      const icon = L.divIcon({
        className: 'spot-marker',
        html: `
          <div class="spot-icon">${spot.category.icon}</div>
          <div class="spot-text">
            <div class="spot-title">${spot.name}</div>
            <div class="spot-time">${new Date(spot.created).toLocaleString()}</div>
          </div>
        `,
        iconSize: [150, 100],
        iconAnchor: [75, 100],
      });

      const marker = L.marker([spot.lat, spot.lng], { icon })
        .addTo(markerLayer)
        .on('click', () => onSpotClick(spot));

      marker.bindPopup(`
        <h3>${spot.name}</h3>
        <p>Category: ${spot.category.name}</p>
        <p>Created: ${new Date(spot.created).toLocaleString()}</p>
      `);
    });

    return () => {
      map.removeLayer(markerLayer);
    };
  }, [map, spots, onSpotClick]);

  return null;
};

export default DynamicMarkers;