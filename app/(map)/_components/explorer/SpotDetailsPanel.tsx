import React from "react";
import {
  Navigation,
  MapPin,
  Tag,
  Calendar,
  CheckCircle,
  Globe,
  Map,
  AlertTriangle,
} from "lucide-react";
import { pb } from "@/lib/db";
import { Spot } from "@/types";

interface SpotDetailsBoxProps {
  spot: Spot;
  onClose: () => void;
}

function SpotDetailsBox({ spot, onClose }: SpotDetailsBoxProps) {
  const getImageUrl = (imageFilename: string) => {
    return `${pb.baseUrl}/api/files/spots/${spot.id}/${imageFilename}`;
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <header className="p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{spot.name}</h1>
          <p className="text-sm text-gray-600 flex items-center">
            <span className="mr-1">{spot.category.icon}</span>
            {spot.category.name}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <svg width="13" height="13" viewBox="0 0 17 17">
            <polygon
              fill="#000000"
              opacity="0.6"
              points="15.2311234 17 8.51565378 10.174954 1.76887661 17 0 15.2467772 6.80939227 8.53130755 0 1.67495396 1.76887661 0 8.51565378 6.73112339 15.2311234 0 17 1.67495396 10.2375691 8.53130755 17 15.2467772"
            ></polygon>
          </svg>
        </button>
      </header>
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
      <div className="p-4 bg-gray-50">
        <ul className="space-y-2">
          <li>
            <a
              href={`geo:${spot.lat},${spot.lng}?q=${spot.lat},${
                spot.lng
              }(${encodeURIComponent(spot.name)})`}
              className="flex items-center w-full p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Map className="w-6 h-6 mr-3" />
              <span>Open in Maps app</span>
            </a>
          </li>
          <li>
            <a
              href={`https://www.openstreetmap.org/?mlat=${spot.lat}&mlon=${spot.lng}&zoom=19`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-full p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Globe className="w-6 h-6 mr-3" />
              <span>Open on OpenStreetMap</span>
            </a>
          </li>
          <li>
            <button className="flex items-center w-full p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <AlertTriangle className="w-6 h-6 mr-3" />
              <span>Report this spot</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SpotDetailsBox;
