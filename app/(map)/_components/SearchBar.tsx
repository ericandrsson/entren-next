import { useState, useCallback, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import debounce from "lodash/debounce";

interface SearchResult {
  id: number;
  type: string;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    amenity?: string;
    shop?: string;
    'addr:street'?: string;
    'addr:housenumber'?: string;
    'addr:postcode'?: string;
    'addr:city'?: string;
  };
}

interface ProcessedSearchResult extends SearchResult {
  category: string;
  displayName: string;
  address: string;
}

interface SearchBarProps {
  onSelectPlace: (lat: number, lon: number) => void;
}

function SearchBar({ onSelectPlace }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProcessedSearchResult[]>([]);
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
      const overpassQuery = `
        [out:json];
        area["ISO3166-1"="SE"][admin_level=2];
        (
          node["name"~"${searchQuery}", i](area)["amenity"~"cafe|restaurant|bar|pub|fast_food"];
          node["name"~"${searchQuery}", i](area)["shop"];
          way["name"~"${searchQuery}", i](area)["amenity"~"cafe|restaurant|bar|pub|fast_food"];
          way["name"~"${searchQuery}", i](area)["shop"];
        );
        out center;
      `;

      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: overpassQuery,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Search results:", data);

      const processedData: ProcessedSearchResult[] = data.elements.map(
        (item: SearchResult) => ({
          ...item,
          category: item.tags.amenity || item.tags.shop || "Unknown",
          displayName: item.tags.name || "Unnamed",
          address: [
            item.tags['addr:housenumber'],
            item.tags['addr:street'],
            item.tags['addr:postcode'],
            item.tags['addr:city']
          ].filter(Boolean).join(", ") || "Address unknown"
        })
      );

      setResults(processedData);
      if (processedData.length === 0) {
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

  const handleSelectPlace = (result: ProcessedSearchResult) => {
    onSelectPlace(result.lat, result.lon);
    setResults([]);
    setQuery("");
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] w-64 sm:w-96 bg-white rounded-lg shadow-lg">
      <div className="flex relative p-2">
        <Input
          type="text"
          placeholder="Search for cafes, restaurants, shops in Sweden..."
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
              key={result.id}
              className="p-3 hover:bg-gray-100 cursor-pointer transition duration-150 ease-in-out"
              onClick={() => handleSelectPlace(result)}
            >
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm">{result.displayName}</h3>
                  <p className="text-xs text-gray-600 mt-1">{result.category}</p>
                  <p className="text-xs text-gray-500 mt-1">{result.address}</p>
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
