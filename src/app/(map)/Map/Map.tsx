"use client";

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useStore } from '@/src/app/lib/store';
import MapControls from './MapControls';
import { Spot } from '@/src/types/custom.types';
import { supabase } from '@/src/lib/supabase';

function Map() {
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { mapView, debouncedFetchSpots, selectedSpot, setSelectedSpot, setMapInstance } = useStore();
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapStyle, setMapStyle] = useState<any>(null);

  useEffect(() => {
    const fetchMapStyle = async () => {
      const response = await fetch('/api/map-style');
      const style = await response.json();
      console.log(style);
      setMapStyle(style);
    };

    fetchMapStyle();
  }, []);

  const defaultCenter: [number, number] = [57.0, 15.0]; // Slightly south of the center of Sweden
  const defaultZoom = 6;

  const { center, zoom } = mapView;

  useEffect(() => {
    if (map.current || !mapContainer) return; // Initialize map only once when mapContainer is available

    map.current = new maplibregl.Map({
      container: mapContainer,
      style: mapStyle, // style URL
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
        url: 'http://localhost:3010/detailed_spots_view',
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
      
      
      map.current?.on('click', 'detailed_spots_view', async (e) => {
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer';
          const geometry = e.features?.[0]?.geometry;
          if (geometry && 'coordinates' in geometry) {
            const properties = e.features?.[0]?.properties ?? {};
            console.log(properties);
            const { data: spot, error } = await supabase
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