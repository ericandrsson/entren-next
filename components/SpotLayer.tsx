import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';
import SpotMarker from './SpotMarker';
import { pb } from '@/lib/db';

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

interface SpotLayerProps {
  isAdmin: boolean;
  user: any; // Replace 'any' with your user type
  onSpotClick: (spot: Spot) => void;
}

const SpotLayer: React.FC<SpotLayerProps> = ({ isAdmin, user, onSpotClick }) => {
  const [spots, setSpots] = useState<Spot[]>([]);
  const map = useMap();

  const fetchSpots = async (bounds: LatLngBounds) => {
    try {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      let filter = `lat >= ${sw.lat} && lat <= ${ne.lat} && lng >= ${sw.lng} && lng <= ${ne.lng}`;

      if (!isAdmin) {
        filter += ` && (isPublic = true || user = "${user?.id}")`;
      }

      const currentZoom = map.getZoom();
      const limit = currentZoom < 5 ? 100 : 1000;

      const result = await pb.collection("spots").getList<Spot>(1, limit, {
        filter: filter,
        sort: "-created",
        expand: "category",
      });

      setSpots(result.items);
    } catch (error) {
      console.error("Error fetching spots:", error);
    }
  };

  useEffect(() => {
    const handleMoveEnd = () => {
      fetchSpots(map.getBounds());
    };

    map.on('moveend', handleMoveEnd);
    fetchSpots(map.getBounds());

    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, isAdmin, user]);

  return (
    <>
      {spots.map((spot) => (
        <SpotMarker key={spot.id} spot={spot} onClick={onSpotClick} />
      ))}
    </>
  );
};

export default SpotLayer;