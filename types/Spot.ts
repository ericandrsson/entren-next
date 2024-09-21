export interface UnverifiedSpotInterface {
  osm_id: string;
  name: string | null;
  lat: number;
  lng: number;
  category: {
    id: string;
    name: string;
    icon: string;
  };
  description?: string;
  tags?: string[];
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

export function transformOverpassNode(node: any): UnverifiedSpotInterface {
  const category = determineCategory(node.tags);
  return {
    osm_id: `node/${node.id}`,
    name: node.tags.name,
    lat: node.lat,
    lng: node.lon,
    category: {
      id: category,
      name: getCategoryName(category),
      icon: getCategoryIcon(category),
    },
    tags: Object.entries(node.tags).map(([key, value]) => `${key}:${value}`),
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
    },
    openingHours: node.tags.opening_hours,
  };
}

function determineCategory(tags: { [key: string]: string }): string {
  // ATM
  if (tags.amenity === "atm") return "atm";

  // Bank
  if (tags.amenity === "bank" || tags.amenity === "bureau_de_change")
    return "bank";

  // Bar/Pub
  if (tags.amenity === "bar" || tags.amenity === "pub") return "bar_pub";

  // Beauty Salon
  if (tags.shop === "beauty" || tags.shop === "hairdresser")
    return "beauty_salon";

  // Cafe
  if (tags.amenity === "cafe" || tags.amenity === "coffee_shop") return "cafe";

  // Cinema
  if (
    tags.amenity === "cinema" ||
    tags.amenity === "theatre" ||
    tags.amenity === "movie_theater"
  )
    return "cinema";

  // Clinic
  if (tags.amenity === "clinic" || tags.amenity === "medical_center")
    return "clinic";

  // Convenience Store
  if (tags.shop === "convenience" || tags.shop === "kiosk")
    return "convenience_store";

  // Education
  if (
    tags.amenity === "school" ||
    tags.amenity === "university" ||
    tags.amenity === "library"
  ) {
    return "education";
  }

  // Fast Food
  if (tags.amenity === "fast_food" || tags.amenity === "burger_joint")
    return "fast_food";

  // Fitness Center
  if (
    tags.leisure === "fitness_centre" ||
    tags.leisure === "gyms" ||
    tags.leisure === "sports_centre"
  ) {
    return "fitness_center";
  }

  // Grocery Store
  if (tags.shop === "supermarket" || tags.shop === "grocery")
    return "grocery_store";

  // Hospital
  if (tags.amenity === "hospital" || tags.amenity === "emergency_room")
    return "hospital";

  // Tourism
  if (
    tags.tourism === "hotel" ||
    tags.tourism === "motel" ||
    tags.tourism === "hostel"
  ) {
    return "hotel";
  }
  if (tags.tourism) {
    return "tourism";
  }

  // Leisure
  if (
    tags.leisure === "park" ||
    tags.leisure === "playground" ||
    tags.leisure === "recreation_ground"
  ) {
    return "leisure";
  }

  // Parking
  if (
    tags.amenity === "parking" ||
    tags.amenity === "garage" ||
    tags.amenity === "multi_storey_parking"
  ) {
    return "parking";
  }

  // Pharmacy
  if (tags.amenity === "pharmacy" || tags.amenity === "drugstore")
    return "pharmacy";

  // Post Office
  if (tags.amenity === "post_office") return "post_office";

  // Restaurant
  if (
    tags.amenity === "restaurant" ||
    tags.amenity === "bistro" ||
    tags.amenity === "diner"
  ) {
    return "restaurant";
  }

  // Shopping
  if (
    tags.shop === "mall" ||
    tags.shop === "boutique" ||
    tags.shop === "department_store" ||
    tags.shop === "convenience" ||
    tags.shop === "kiosk"
  ) {
    return "shopping";
  }

  if (tags.shop) {
    return "shopping";
  }

  // Sports Facility
  if (
    tags.leisure === "stadium" ||
    tags.leisure === "sports_field" ||
    tags.leisure === "tennis_court"
  ) {
    return "sports_facility";
  }

  // Taxi Stand
  if (tags.amenity === "taxi") return "taxi_stand";

  // Toilet
  if (
    tags.amenity === "toilets" ||
    tags.amenity === "public_toilets" ||
    tags.amenity === "restroom"
  ) {
    return "toilet";
  }

  // Tourist Attraction
  if (
    tags.tourism === "museum" ||
    tags.tourism === "gallery" ||
    tags.tourism === "monument" ||
    tags.tourism === "zoo"
  ) {
    return "tourist_attraction";
  }

  // Transport
  if (
    tags.public_transport ||
    tags.railway === "station" ||
    tags.railway === "tram_stop" ||
    tags.highway === "bus_stop"
  ) {
    return "transport";
  }

  // Miscellaneous
  if (tags.shop === "funeral_directors") return "other";

  return "other";
}

function getCategoryName(category: string): string {
  const nameMap: { [key: string]: string } = {
    atm: "ATM",
    bank: "Bank",
    bar_pub: "Bar/Pub",
    beauty_salon: "Beauty Salon",
    cafe: "Cafe",
    cinema: "Cinema",
    clinic: "Clinic",
    convenience_store: "Convenience Store",
    education: "Education",
    fast_food: "Fast Food",
    fitness_center: "Fitness Center",
    grocery_store: "Grocery Store",
    hospital: "Hospital",
    hotel: "Hotel",
    leisure: "Leisure",
    parking: "Parking",
    pharmacy: "Pharmacy",
    post_office: "Post Office",
    restaurant: "Restaurant",
    shopping: "Shopping",
    sports_facility: "Sports Facility",
    taxi_stand: "Taxi Stand",
    toilet: "Toilet",
    tourist_attraction: "Tourist Attraction",
    transport: "Transport",
    other: "Other",
  };
  return nameMap[category] || "Other";
}

function getCategoryIcon(category: string): string {
  const iconMap: { [key: string]: string } = {
    atm: "🏧",
    bank: "🏦",
    bar_pub: "🍺",
    beauty_salon: "💇‍♀️",
    cafe: "☕️",
    cinema: "🎬",
    clinic: "🏥",
    convenience_store: "🏪",
    education: "🎓",
    fast_food: "🍔",
    fitness_center: "🏋️‍♂️",
    grocery_store: "🛒",
    hospital: "🏥",
    hotel: "🏨",
    leisure: "🌳",
    parking: "🅿️",
    pharmacy: "💊",
    post_office: "📮",
    restaurant: "🍽️",
    shopping: "🛍️",
    sports_facility: "⚽️",
    taxi_stand: "🚖",
    toilet: "🚻",
    tourist_attraction: "🏛️",
    transport: "🚆",
    tourism: "🏰",
    kiosk: "🏪",
    convenience: "🏪",
    other: "📍",
  };
  return iconMap[category] || "📍";
}
