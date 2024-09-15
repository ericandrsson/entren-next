import React, { useEffect, useState, useCallback } from "react";
import { useMap } from "react-leaflet";
import { LatLngBounds } from "leaflet";
import DynamicMarkers from "./DynamicMarkers";
import { pb } from "@/lib/db";

interface Spot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: {
    id: string;
    name: string;
    icon: string;
  };
  created: string;
  description?: string;
  user: string;
  isPublic: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface SpotLayerProps {
  isAdmin: boolean;
  user: any; // Replace 'any' with your user type
  onSpotClick: (spot: Spot) => void;
}

const SpotLayer: React.FC<SpotLayerProps> = ({
  isAdmin,
  user,
  onSpotClick,
}) => {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const map = useMap();

  const fetchSpots = useCallback(
    async (bounds: LatLngBounds) => {
      try {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        let filter = `lat >= ${sw.lat} && lat <= ${ne.lat} && lng >= ${sw.lng} && lng <= ${ne.lng}`;

        const currentZoom = map.getZoom();
        const limit = currentZoom < 5 ? 100 : 1000;

        const result = await pb.collection("spots").getList<Spot>(1, limit, {
          filter: filter,
          sort: "-created",
          expand: "category",
        });

        console.log("Fetched spots:", result.items); // Add this line

        setSpots(result.items);
      } catch (error) {
        console.error("Error fetching spots:", error);
      }
    },
    [map, isAdmin, user]
  );

  const fetchCategories = useCallback(async () => {
    try {
      const result = await pb
        .collection("spot_categories")
        .getFullList<Category>();
      setCategories(result);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    const handleMoveEnd = () => {
      fetchSpots(map.getBounds());
    };

    map.on("moveend", handleMoveEnd);
    fetchSpots(map.getBounds());
    fetchCategories();

    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [map, fetchSpots, fetchCategories]);

  const handleSpotDelete = async (id: string) => {
    try {
      await pb.collection("spots").delete(id);
      setSpots(spots.filter((spot) => spot.id !== id));
    } catch (error) {
      console.error("Error deleting spot:", error);
    }
  };

  const handleSpotUpdate = async (id: string, isPublic: boolean) => {
    try {
      await pb.collection("spots").update(id, { isPublic });
      setSpots(
        spots.map((spot) => (spot.id === id ? { ...spot, isPublic } : spot))
      );
    } catch (error) {
      console.error("Error updating spot:", error);
    }
  };

  return (
    <DynamicMarkers
      spots={spots}
      categories={categories}
      handleSpotDelete={handleSpotDelete}
      handleSpotUpdate={handleSpotUpdate}
      user={user}
      isAdmin={isAdmin}
      onSpotClick={onSpotClick}
    />
  );
};

export default SpotLayer;
