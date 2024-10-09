"use client";

import { useStore } from "@/src/libs/store";
import { createClient } from "@/utils/supabase/client";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useCallback, useEffect, useRef, useState } from "react";

function Map() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const {
    mapView,
    debouncedFetchSpots,
    selectedSpot,
    setSelectedSpot,
    setMapInstance,
  } = useStore();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const defaultCenter: [number, number] = [57.0, 15.0]; // Slightly south of the center of Sweden
  const defaultZoom = 6;

  const { center, zoom } = mapView;

  const supabase = createClient();

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
        center: center || defaultCenter,
        zoom: zoom || defaultZoom,
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
        map.current?.addSource("detailedSpots", {
          type: "vector",
          url: "http://p4o0gckwc0wokcgoscws0c0s.135.181.108.171.sslip.io//detailed_spots_view",
        });

        map.current?.addLayer({
          id: "detailed_spots_view",
          type: "symbol",
          source: "detailedSpots",
          "source-layer": "detailed_spots_view",
          layout: {
            "icon-image": "{category_name}",
            "icon-size": 0.65, // Slightly increased icon size for prominence
            "icon-anchor": "bottom",
            "text-field": "{name}",
            "text-font": ["Noto Sans Bold"],
            "text-size": 14, // Slightly increased text size to enhance readability
            "text-offset": [0, 0.1],
            "text-anchor": "top",
            "icon-allow-overlap": true,
            "text-allow-overlap": true,
            "text-padding": 2, // Adding text padding for more visual space around text
          },
          paint: {
            "icon-opacity": 1, // Set icon opacity to 1 to make it fully visible
            "text-halo-width": 1, // Add a halo to the text for better readability
            "text-halo-color": "rgba(255, 255, 255, 0.75)",
            "text-color": "#348f50", // Choose a color from your theme for text to align with your branding (e.g., a green that complements other elements)
          },
        });

        map.current?.addSource("local_sweden_osm_poi", {
          type: "vector",
          url: "http://p4o0gckwc0wokcgoscws0c0s.135.181.108.171.sslip.io/local_sweden_osm_poi",
        });

        map.current?.addLayer({
          id: "local_sweden_osm_poi_circle",
          type: "circle",
          source: "local_sweden_osm_poi",
          "source-layer": "local_sweden_osm_poi",
          paint: {
            "circle-color": "red",
            "circle-radius": 10,
            "circle-opacity": 0.3,
          },
          minzoom: 10, // Only show when zoomed in
        });

        map.current?.addLayer({
          id: "local_sweden_osm_poi",
          type: "symbol",
          source: "local_sweden_osm_poi",
          "source-layer": "local_sweden_osm_poi",
          layout: {
            "text-field": "{name}",
            "text-font": ["Noto Sans Regular"],
            "text-size": 12,
            "text-offset": [0, 0.1],
            "text-anchor": "top",
          },
          paint: {
            "text-color": "rgba(255, 0, 0, 0.5)",
            "text-halo-width": 1,
            "text-halo-color": "rgba(255, 255, 255, 0.5)",
          },
          minzoom: 10, // Only show when zoomed in
        });

        map.current?.on("click", "detailed_spots_view", async (e) => {
          if (map.current) {
            map.current.getCanvas().style.cursor = "pointer";
            const geometry = e.features?.[0]?.geometry;
            if (geometry && "coordinates" in geometry) {
              const properties = e.features?.[0]?.properties ?? {};
              console.log(properties);
              // Set icon size only for the clicked spot

              const { data: spot } = await supabase
                .from("detailed_spots_view")
                .select("*")
                .eq("spot_id", properties.spot_id)
                .single();
              console.log(spot);
              if (spot) {
                setSelectedSpot(spot);
              }
            }
          }
        });

        map.current?.on("click", "local_sweden_osm_poi", async (e) => {
          console.log("local_sweden_osm_poi");
          if (map.current) {
            map.current.getCanvas().style.cursor = "pointer";
            const geometry = e.features?.[0]?.geometry;
            console.log(geometry);
            if (geometry && "coordinates" in geometry) {
              const properties = e.features?.[0]?.properties ?? {};
              console.log(properties);
            }
          }
        });
        setMapInstance(map.current);
        setIsMapLoaded(true);

        handleResize();
      });

      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(mapContainerRef.current);

      return () => {
        resizeObserver.disconnect();
        if (map.current) {
          console.log("removing map");
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
  }, [
    mapContainerRef.current,
    center,
    zoom,
    setMapInstance,
    debouncedFetchSpots,
    handleResize,
  ]);

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

    map.current.on("moveend", updateVisibleSpots);
    map.current.on("zoomend", updateVisibleSpots);

    // Initial update
    updateVisibleSpots();

    return () => {
      map.current?.off("moveend", updateVisibleSpots);
      map.current?.off("zoomend", updateVisibleSpots);
    };
  }, [isMapLoaded, debouncedFetchSpots]);

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
