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
}