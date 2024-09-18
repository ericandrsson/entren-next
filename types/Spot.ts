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

export interface SpotInterface {
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
  address?: {
    street?: string;
    housenumber?: string;
    postcode?: string;
    city?: string;
    country?: string;
  };
  accessibility?: {
    wheelchair?: string;
    toilets?: string;
    tactilePaving?: string;
    hearingImpairedLoop?: string;
  };
  openingHours?: string;
}

export function transformOverpassNode(node: any): SpotInterface {
  const category = determineCategory(node.tags);
  return {
    id: `node/${node.id}`,
    name: node.tags.name || "Unnamed Spot",
    lat: node.lat,
    lng: node.lon,
    category: {
      id: category,
      name: getCategoryName(category),
      icon: getCategoryIcon(category),
    },
    created: new Date().toISOString(), // Use current date as creation date for unverified spots
    tags: Object.entries(node.tags).map(([key, value]) => `${key}:${value}`),
    user: "system", // Or any default user for unverified spots
    isVerified: false,
    address: {
      street: node.tags["addr:street"],
      housenumber: node.tags["addr:housenumber"],
      postcode: node.tags["addr:postcode"],
      city: node.tags["addr:city"],
      country: node.tags["addr:country"],
    },
    accessibility: {
      wheelchair: node.tags.wheelchair || "unknown",
      toilets: node.tags["wheelchair:toilet"] || "unknown",
      tactilePaving: node.tags.tactile_paving,
      hearingImpairedLoop: node.tags["hearing_impaired:induction_loop"],
    },
    openingHours: node.tags.opening_hours,
  };
}

function determineCategory(tags: { [key: string]: string }): string {
  if (tags.shop === "funeral_directors") return "funeral_home";
  if (tags.shop === "clothes") return "clothes";
  if (tags.shop === "hairdresser") return "barber";
  if (tags.shop === "carpet") return "shopping";
  if (tags.shop === "supermarket") return "supermarket";
  if (tags.shop === "beauty") return "beauty";
  if (tags.shop === "sports") return "sports";
  if (tags.shop) return "shopping";
  if (tags.amenity === "restaurant" || tags.amenity === "cafe") return "food";
  if (tags.amenity === "fast_food") return "fast_food";
  if (tags.public_transport) return "transport";
  if (tags.tourism === "hotel" || tags.hotel) return "hotel";
  if (tags.tourism && tags.tourism !== "hotel") return "tourism";
  if (tags.amenity === "school") return "education";
  if (tags.amenity === "hospital") return "health";
  if (tags.amenity === "bank") return "money";
  if (tags.leisure) return "leisure";
  if (tags.amenity === "toilets") return "toilets";
  if (tags.sport === "tennis") return "sports";
  return "other";
}

function getCategoryName(category: string): string {
  // Implement this function to return the category name based on the category id
  // You can use a mapping or switch statement
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function getCategoryIcon(category: string): string {
  // Implement this function to return the category icon based on the category id
  // You can use a mapping or switch statement
  const iconMap: { [key: string]: string } = {
    sports: "⚽️",
    beauty: "💄",
    supermarket: "🛒",
    fast_food: "🍔",
    barber: "💈",
    clothes: "👕",
    funeral_home: "🪦",
    hotel: "🏨",
    shopping: "🛍️",
    food: "🍽️",
    transport: "🚆",
    tourism: "🏛️",
    education: "🎓",
    health: "🏥",
    money: "🏦",
    leisure: "🎭",
    toilets: "🚻",
    other: "📍",
  };
  return iconMap[category] || "📍";
}
