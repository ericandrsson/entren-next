import { useState, useCallback, useEffect } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import debounce from "lodash/debounce";
import { SearchResult } from "@/types";

interface SearchBarProps {
  onSelectPlace: (result: SearchResult) => void;
  onFocus: () => void;
  onBlur: () => void;
  isFilterOpen: boolean;
  toggleFilter: () => void;
}

function SearchBar({
  onSelectPlace,
  onFocus,
  onBlur,
  isFilterOpen,
  toggleFilter,
}: SearchBarProps) {
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
        `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&countrycodes=se&limit=10&accept-language=sv`
      );

      if (!response.ok) {
        throw new Error(`HTTP-fel! status: ${response.status}`);
      }

      const data: SearchResult[] = await response.json();
      console.log("Search results:", data);

      setResults(data);
      if (data.length === 0) {
        setError("Inga platser hittades, prova med en annan sökterm.");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("An error occurred while searching. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => handleSearch(searchQuery), 300),
    [handleSearch]
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  const handleSelectPlace = (result: SearchResult) => {
    onSelectPlace(result);
    setResults([]);
    setQuery("");
  };

  return (
    <div className="w-full">
      <div className="flex relative">
        <Input
          type="text"
          placeholder="Sök plats eller adress..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          className="w-full pr-20 text-base text-gray-900 placeholder-gray-500"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-600 mr-2" />
          ) : (
            <Search className="h-5 w-5 text-gray-600 mr-2" />
          )}
          <button
            onClick={toggleFilter}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
          >
            <Filter
              className={`h-5 w-5 ${
                isFilterOpen ? "text-blue-500" : "text-gray-600"
              }`}
            />
          </button>
        </div>
      </div>
      {error && <p className="text-red-600 text-sm p-2 font-medium">{error}</p>}
      {results.length > 0 && (
        <ul className="mt-2 border-t divide-y divide-gray-200 max-h-80 overflow-y-auto">
          {results.map((result) => (
            <li
              key={result.place_id}
              className="p-3 hover:bg-gray-100 cursor-pointer transition duration-150 ease-in-out"
              onClick={() => handleSelectPlace(result)}
            >
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-600 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-base text-gray-900">
                    {result.display_name.split(",")[0]}
                  </h3>
                  <p className="text-sm text-gray-700 mt-1">
                    {result.display_name.split(",").slice(1).join(",")}
                  </p>
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
