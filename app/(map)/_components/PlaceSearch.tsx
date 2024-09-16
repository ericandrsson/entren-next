import { useState } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useMap } from 'react-leaflet';

interface PlaceSearchProps {
  onPlaceSelected: (lat: number, lng: number, name: string) => void;
}

function PlaceSearch({ onPlaceSelected }: PlaceSearchProps) {
  const map = useMap();
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      map.flyTo([lat, lng], 15);
      onPlaceSelected(lat, lng, address);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder="Search for a place"
        className="w-full p-2 border rounded"
      />
      {status === "OK" && (
        <ul className="absolute z-10 w-full bg-white border rounded mt-1">
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PlaceSearch;