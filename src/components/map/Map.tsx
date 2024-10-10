"use client";

import { useStore } from "@/src/libs/store";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useCallback, useEffect, useRef } from "react";

function Map() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { mapView, selectedPlace, setMapInstance, onMapLoad } = useStore();

  const defaultCenter: [number, number] = [57.0, 15.0]; // Slightly south of the center of Sweden
  const defaultZoom = 6;
  const { userLocation } = useStore();

  // Function to handle resize
  const handleResize = useCallback(() => {
    if (map.current) {
      map.current.resize();
    }
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!map.current) {
      map.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: "/api/map-style", // Points to the dynamic style API route
        transformRequest: (url, resourceType) => {
          if (resourceType === "Style" && url.startsWith("/api/map-style")) {
            return {
              url,
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
              },
            };
          }
          return { url };
        },
        center: userLocation
          ? [userLocation.longitude, userLocation.latitude]
          : defaultCenter,
        zoom: userLocation ? 12 : defaultZoom,
        minZoom: 4,
        maxZoom: 20,
        bounds: [
          [10.54138, 54.52652], // Adjusted Southwest coordinates
          [24.22472, 68.56643], // Adjusted Northeast coordinates
        ],
        maxBounds: [
          [9.54138, 53.52652], // Adjusted Southwest coordinates
          [25.22472, 69.56643], // Adjusted Northeast coordinates
        ],
      });

      map.current.on("load", () => {
        if (map.current) {
          onMapLoad(map.current);
        }
        handleResize();
      });

      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(mapContainerRef.current);

      return () => {
        resizeObserver.disconnect();
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    }

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      map.current?.remove();
    };
  }, [mapContainerRef.current, setMapInstance, handleResize]);

  useEffect(() => {
    if (selectedPlace && map.current) {
      map.current.flyTo({
        center: [selectedPlace.long!, selectedPlace.lat!],
        zoom: 12,
        essential: true,
      });
    }
  }, [selectedPlace]);

  // Add a new useEffect to handle layout changes
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [handleResize]);

  return <div ref={mapContainerRef} className="w-full h-full relative"></div>;
}

export default React.memo(Map);
