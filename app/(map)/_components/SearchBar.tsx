import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface SearchBarProps {
  onSelectPlace: (lat: number, lon: number) => void;
}

function SearchBar({ onSelectPlace }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`
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
  }, [query]);

  const handleSelectPlace = (result: SearchResult) => {
    onSelectPlace(parseFloat(result.lat), parseFloat(result.lon));
    setResults([]);
    setQuery("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] w-64 sm:w-80">
      <div className="flex">
        <Input
          type="text"
          placeholder="Search for a place..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="rounded-r-none"
        />
        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="rounded-l-none"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {results.length > 0 && (
        <ul className="mt-2 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {results.map((result) => (
            <li
              key={result.place_id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectPlace(result)}
            >
              {result.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
