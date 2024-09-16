import { useState } from 'react';
import { useMap } from 'react-leaflet';

interface OverpassSearchProps {
  onPlaceSelected: (lat: number, lng: number, name: string, type: string) => void;
}

function OverpassSearch({ onPlaceSelected }: OverpassSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const map = useMap();

  const searchOverpass = async () => {
    const query = `
      [out:json];
      area[name="Sweden"]->.searchArea;
      (
        node["name"~"${searchTerm}", i](area.searchArea);
        way["name"~"${searchTerm}", i](area.searchArea);
        relation["name"~"${searchTerm}", i](area.searchArea);
      );
      out center;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });

    const data = await response.json();
    setResults(data.elements);
  };

  const handleSelect = (result: any) => {
    const lat = result.lat || result.center.lat;
    const lng = result.lon || result.center.lon;
    map.flyTo([lat, lng], 15);
    onPlaceSelected(lat, lng, result.tags.name, result.type);
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white p-4 rounded shadow-md">
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a place"
        className="w-full p-2 border rounded mb-2"
      />
      <button onClick={searchOverpass} className="w-full p-2 bg-blue-500 text-white rounded">
        Search
      </button>
      {results.length > 0 && (
        <ul className="mt-2 max-h-60 overflow-y-auto">
          {results.map((result) => (
            <li
              key={result.id}
              onClick={() => handleSelect(result)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {result.tags.name} ({result.type})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OverpassSearch;