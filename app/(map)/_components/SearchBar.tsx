import { useState, useCallback, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import debounce from "lodash/debounce";

interface SearchResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  importance: number;
  osm_id: number;
  osm_type: string;
}

interface SearchBarProps {
  onSelectPlace: (lat: number, lon: number, name: string, osmId: number, osmType: string, rawData: any) => void;
}

function SearchBar({ onSelectPlace }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&countrycodes=se&limit=10`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SearchResult[] = await response.json();
      console.log("Search results:", data);

      setResults(data);
      if (data.length === 0) {
        setError("No results found");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("An error occurred while searching. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce the search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => handleSearch(searchQuery), 300),
    [handleSearch]
  );

  useEffect(() => {
    debouncedSearch(query);
    // Cancel the debounce on useEffect cleanup
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  const handleSelectPlace = (result: SearchResult) => {
    const placeName = result.display_name.split(',')[0].trim();
    
    onSelectPlace(
      parseFloat(result.lat),
      parseFloat(result.lon),
      placeName,
      result.osm_id,
      result.osm_type,
      result // Pass the entire result object as rawData
    );
    setResults([]);
    setQuery("");
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] w-64 sm:w-96 bg-white rounded-lg shadow-lg">
      <div className="flex relative p-2">
        <Input
          type="text"
          placeholder="Search for places in Sweden..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10"
        />
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin absolute right-5 top-1/2 transform -translate-y-1/2" />
        ) : (
          <Search className="h-4 w-4 absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400" />
        )}
      </div>
      {error && <p className="text-red-500 text-sm p-2">{error}</p>}
      {results.length > 0 && (
        <ul className="mt-2 border-t divide-y divide-gray-200 max-h-80 overflow-y-auto">
          {results.map((result) => (
            <li
              key={result.place_id}
              className="p-3 hover:bg-gray-100 cursor-pointer transition duration-150 ease-in-out"
              onClick={() => handleSelectPlace(result)}
            >
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm">
                    {result.display_name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">{result.type}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
