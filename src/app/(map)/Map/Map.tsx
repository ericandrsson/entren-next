"use client";

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useStore } from '@/src/app/lib/store';
import MapControls from './MapControls';
import { createClient } from '@/utils/supabase/client';

function Map() {
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { mapView, debouncedFetchSpots, selectedSpot, setSelectedSpot, setMapInstance } = useStore();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const defaultCenter: [number, number] = [57.0, 15.0]; // Slightly south of the center of Sweden
  const defaultZoom = 6;

  const { center, zoom } = mapView;

  const supabase = createClient();

  useEffect(() => {
    if (map.current || !mapContainer) return; // Initialize map only once when mapContainer is available

    map.current = new maplibregl.Map({
      container: mapContainer,
      style: '/api/map-style', // Points to the dynamic style API route
      transformRequest: (url, resourceType) => {
        if (resourceType === 'Style' && url.startsWith('/api/map-style')) {
          return {
            url,
            headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}` },
          };
        }
        return { url };
      },
      center: center || defaultCenter,
      zoom: zoom || defaultZoom,
      minZoom: 4,
      maxZoom: 20,
      bounds: [
        [10.54138, 54.52652], // Adjusted Southwest coordinates
        [24.22472, 68.56643]  // Adjusted Northeast coordinates
      ],
      maxBounds: [
        [9.54138, 53.52652], // Adjusted Southwest coordinates
        [25.22472, 69.56643]  // Adjusted Northeast coordinates
      ]
    });

    map.current.on('load', () => {
      map.current?.addSource('detailedSpots', {
        type: 'vector',
        url: 'http://p4o0gckwc0wokcgoscws0c0s.135.181.108.171.sslip.io//detailed_spots_view',
      });
      
      map.current?.addLayer({
        id: 'detailed_spots_view',
        type: 'symbol',
        source: 'detailedSpots',
        'source-layer': 'detailed_spots_view',
        layout: {
          'icon-image': '{category_name}',
          'icon-size': 0.5,  // Reduced icon size for better clarity
          'icon-anchor': 'bottom',
          'text-field': '{name}',
          'text-font': ['Noto Sans Bold'],
          'text-size': 12,  // Reduced text size for better balance
          'text-offset': [0, 0.1],
          'text-anchor': 'top',
          'icon-allow-overlap': true,
          'text-allow-overlap': true
        },
        paint: {
          'icon-opacity': 0.9,  // Slightly reduce opacity to soften the icon
          'text-halo-width': 1,  // Add a halo to the text for better readability
          'text-halo-color': 'rgba(255, 255, 255, 0.75)'
        }
      });


      map.current?.addSource('local_sweden_osm_poi', {
        type: 'vector',
        url: 'http://p4o0gckwc0wokcgoscws0c0s.135.181.108.171.sslip.io/local_sweden_osm_poi',
      });

      map.current?.addLayer({
        id: 'local_sweden_osm_poi_circle',
        type: 'circle',
        source: 'local_sweden_osm_poi',
        'source-layer': 'local_sweden_osm_poi',
        paint: {
          'circle-color': 'red',
          'circle-radius': 5,
          'circle-opacity': 0.3
        },
        minzoom: 10 // Only show when zoomed in
      });

      map.current?.addLayer({
        id: 'local_sweden_osm_poi',
        type: 'symbol',
        source: 'local_sweden_osm_poi',
        'source-layer': 'local_sweden_osm_poi',
        layout: {
          'text-field': '{name}',
          'text-font': ['Noto Sans Regular'],
          'text-size': 12,
          'text-offset': [0, 0.1],
          'text-anchor': 'top',
        },
        paint: {
          'text-color': 'rgba(255, 0, 0, 0.5)',
          'text-halo-width': 1,
          'text-halo-color': 'rgba(255, 255, 255, 0.5)'
        },
        minzoom: 10 // Only show when zoomed in
      });
      
      
      map.current?.on('click', 'detailed_spots_view', async (e) => {
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer';
          const geometry = e.features?.[0]?.geometry;
          if (geometry && 'coordinates' in geometry) {
            const properties = e.features?.[0]?.properties ?? {};
            const { data: spot } = await supabase
            .from('detailed_spots_view')
            .select('*')
            .eq('spot_id', properties.spot_id)
            .single();
            setSelectedSpot(spot);
          }
        }
      });

      setMapInstance(map.current);
      setIsMapLoaded(true);
    });




    return () => {
      map.current?.remove();
    };
  }, [mapContainer, center, zoom, setMapInstance, debouncedFetchSpots]);

  useEffect(() => {
    if (selectedSpot && map.current) {
      map.current.flyTo({
        center: [selectedSpot.long!, selectedSpot.lat!],
        zoom: 16,
        essential: true,
      });
    }
  }, [selectedSpot]);

  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    const updateVisibleSpots = () => {
      const bounds = map.current?.getBounds();
      if (bounds) {
        debouncedFetchSpots(bounds);
      }
    };

    map.current.on('moveend', updateVisibleSpots);
    map.current.on('zoomend', updateVisibleSpots);

    // Initial update
    updateVisibleSpots();

    return () => {
      map.current?.off('moveend', updateVisibleSpots);
      map.current?.off('zoomend', updateVisibleSpots);
    };
  }, [isMapLoaded, debouncedFetchSpots]);

  return (
    <div ref={setMapContainer} className="w-full h-full">
      <MapControls map={map.current} />
    </div>
  );
}

export default React.memo(Map);