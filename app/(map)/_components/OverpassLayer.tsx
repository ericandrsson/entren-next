import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface Hotel {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags: {
    name?: string;
    "addr:street"?: string;
    "addr:housenumber"?: string;
  };
}

function OverpassLayer() {
  const map = useMap();
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    const fetchHotels = async () => {
      const bounds = map.getBounds();
      const query = `
        [out:json][timeout:25];
        (
          node["tourism"="hotel"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
          way["tourism"="hotel"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
          relation["tourism"="hotel"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
        );
        out center;
      `;

      try {
        const response = await fetch(`https://overpass-api.de/api/interpreter`, {
          method: "POST",
          body: query,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched hotels:", data.elements);
        setHotels(data.elements);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchHotels();

    map.on('moveend', fetchHotels);

    return () => {
      map.off('moveend', fetchHotels);
    };
  }, [map]);

  useEffect(() => {
    const markerGroup = L.layerGroup().addTo(map);

    hotels.forEach((hotel) => {
      let lat, lon;
      if (hotel.type === 'node') {
        lat = hotel.lat;
        lon = hotel.lon;
      } else if (hotel.center) {
        lat = hotel.center.lat;
        lon = hotel.center.lon;
      }

      if (lat && lon) {
        const marker = L.marker([lat, lon]);
        marker.bindPopup(`
          <b>${hotel.tags.name || "Unnamed Hotel"}</b><br>
          ${hotel.tags["addr:street"] || ""} ${hotel.tags["addr:housenumber"] || ""}
        `);
        marker.addTo(markerGroup);
      }
    });

    console.log(`Added markers for ${hotels.length} hotels to the map`);

    return () => {
      map.removeLayer(markerGroup);
    };
  }, [hotels, map]);

  return null;
}

export default OverpassLayer;
