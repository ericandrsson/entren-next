export interface Spot {
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