export interface Spot {
  id: string;
  name: string;
  address?: string;
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
  isVerified: boolean;
  image: string;
}

export interface SearchResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  importance: number;
  osm_id: number;
  osm_type: string;
}
