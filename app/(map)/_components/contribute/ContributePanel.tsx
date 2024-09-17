import React, { useState, useEffect } from 'react';
import { Map as LeafletMap } from 'leaflet';
import { useMap } from 'react-leaflet';

interface ContributePanelProps {
  map: LeafletMap | null;
  currentMode: 'view' | 'contribute';
}

const ContributePanel: React.FC<ContributePanelProps> = ({ map, currentMode }) => {
  const [unverifiedPlaces, setUnverifiedPlaces] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);

  useEffect(() => {
    if (map && currentMode === 'contribute') {
      fetchUnverifiedPlaces(map.getBounds());
    }
  }, [map, currentMode]);

  const fetchUnverifiedPlaces = async (bounds: L.LatLngBounds) => {
    // Implement API call to fetch unverified places within the bounds
    // For now, we'll use dummy data
    const dummyData = [
      { id: 1, name: 'Unverified Restaurant', lat: 62.1, lng: 15.1 },
      { id: 2, name: 'Unverified Cafe', lat: 62.2, lng: 15.2 },
    ];
    setUnverifiedPlaces(dummyData);
  };

  const handlePlaceClick = (place: any) => {
    setSelectedPlace(place);
  };

  const handleContribute = (data: any) => {
    // Implement contribution logic
    console.log('Contributing data:', data);
    // Reset selected place after contribution
    setSelectedPlace(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-80">
      <h2 className="text-lg font-semibold mb-4">Contribute Mode</h2>
      {selectedPlace ? (
        <ContributionForm place={selectedPlace} onSubmit={handleContribute} />
      ) : (
        <ul>
          {unverifiedPlaces.map((place) => (
            <li
              key={place.id}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
              onClick={() => handlePlaceClick(place)}
            >
              {place.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface ContributionFormProps {
  place: any;
  onSubmit: (data: any) => void;
}

const ContributionForm: React.FC<ContributionFormProps> = ({ place, onSubmit }) => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [accessibility, setAccessibility] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ photo, accessibility });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-semibold mb-2">{place.name}</h3>
      <div className="mb-4">
        <label className="block mb-2">Upload Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] || null)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Accessibility Features</label>
        <textarea
          value={accessibility}
          onChange={(e) => setAccessibility(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Describe accessibility features..."
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit Contribution
      </button>
    </form>
  );
};

export default ContributePanel;