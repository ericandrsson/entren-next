"use client";

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useStore } from '@/src/app/lib/store';
import MapControls from './MapControls';

function Map() {
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { mapView, debouncedFetchSpots, selectedSpot, setSelectedSpot, view } = useStore();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const defaultCenter: [number, number] = [57.0, 15.0]; // Slightly south of the center of Sweden
  const defaultZoom = 6;

  const { center, zoom } = mapView;

  useEffect(() => {
    if (map.current || !mapContainer) return; // Initialize map only once when mapContainer is available

    map.current = new maplibregl.Map({
      container: mapContainer,
      style: 'http://localhost:3000/map/style/style.json', // style URL
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

    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    map.current.on('load', () => {
      map.current?.addSource('detailedSpots', {
        type: 'vector',
        url: 'http://localhost:3010/detailed_spots_view'
      });
      
      map.current?.addLayer({
        id: 'detailed_spots_view',
        type: 'symbol',
        source: 'detailedSpots',
        'source-layer': 'detailed_spots_view',
        layout: {
          'text-field': '{name}', // Replace with your desired emoji
          'text-font': ['Noto Sans Regular'],
          'text-size': 24,
          'text-offset': [0, -0.5], // Optional: Adjusts the position
          'text-anchor': 'top'      // Optional: Anchors the emoji to the top of the point
        }
      });
      
      setIsMapLoaded(true);

      // Add event listeners for hover
      map.current?.on('mouseenter', 'detailed_spots_view', (e) => {
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer';
          
          const coordinates = e.features[0].geometry.coordinates.slice();
          const properties = e.features[0].properties;
          console.log(properties);
          
          
          // Create HTML content for popup
          const popupContent = `
            <h3>${properties.name || 'Unnamed Spot'}</h3>
            <p>Tags: ${properties.osm_tags || 'N/A'}</p>
          `;

          popup.setLngLat(coordinates).setHTML(popupContent).addTo(map.current);
        }
      });

      map.current?.on('mouseleave', 'detailed_spots_view', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = '';
          popup.remove();
        }
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [mapContainer, center, zoom]);

  useEffect(() => {
    if (selectedSpot && map.current) {
      map.current.flyTo({
        center: [selectedSpot.long!, selectedSpot.lat!],
        zoom: 16,
        essential: true,
      });
    }
  }, [selectedSpot]);

  return (
    <div ref={setMapContainer} className="w-full h-full">
      <MapControls map={map.current} />
    </div>
  );
}

export default React.memo(Map);
