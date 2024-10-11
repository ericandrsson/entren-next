import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { useStore } from '@/src/libs/store';

function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { onMapLoad } = useStore();

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    map.current = new maplibregl.Map({
      container: mapContainer.current!,
      style: 'https://demotiles.maplibre.org/style.json', // Use a default style for testing
      center: [0, 0],
      zoom: 2
    });

    map.current.on('load', () => {
      console.log("Map load event fired");
      if (map.current) {
        onMapLoad(map.current);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [onMapLoad]);

  return <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />;
}

export default Map;
