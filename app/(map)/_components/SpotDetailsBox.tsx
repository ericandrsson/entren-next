import React from "react";
import { Navigation, MapPin, Tag, Calendar, CheckCircle } from "lucide-react";
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
  tags?: string[];
  user: string;
  isVerified: boolean;
  image?: string;
  address?: string;
}

interface SpotDetailsBoxProps {
  spot: Spot | null;
  onClose: () => void;
}

function SpotDetailsBox({ spot, onClose }: SpotDetailsBoxProps) {
  if (!spot) return null;

  const getImageUrl = (imageFilename: string) => {
    return `${pb.baseUrl}/api/files/spots/${spot.id}/${imageFilename}`;
  };

  return (
    <div className="absolute top-20 left-4 z-[1000] w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900">{spot.name}</h2>
        <p className="text-sm text-gray-600">
          {spot.category.icon} {spot.category.name}
        </p>
      </div>
      {spot.image && (
        <div className="w-full h-48 relative">
          <img
            src={getImageUrl(spot.image)}
            alt={spot.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <ul className="space-y-2">
          {spot.address && (
            <li className="flex items-center text-sm">
              <Navigation className="w-4 h-4 mr-2 text-gray-500" />
              {spot.address}
            </li>
          )}
          <li className="flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
            {spot.lat.toFixed(6)}, {spot.lng.toFixed(6)}
          </li>
          {spot.tags && spot.tags.length > 0 && (
            <li className="flex items-center text-sm">
              <Tag className="w-4 h-4 mr-2 text-gray-500" />
              {spot.tags.join(", ")}
            </li>
          )}
          <li className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            Created: {new Date(spot.created).toLocaleDateString()}
          </li>
          <li className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 mr-2 text-gray-500" />
            Verified: {spot.isVerified ? "Yes" : "No"}
          </li>
        </ul>
      </div>
      {spot.description && (
        <div className="p-4 border-t">
          <h3 className="text-sm font-semibold mb-2">Description</h3>
          <p className="text-sm text-gray-700">{spot.description}</p>
        </div>
      )}
      <div className="p-4 bg-gray-50 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default SpotDetailsBox;