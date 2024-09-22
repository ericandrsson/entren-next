"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/lib/assets/MarkerCluster.css";
import "react-leaflet-cluster/lib/assets/MarkerCluster.Default.css";
import MapTileLayer from "./MapTileLayer";
import SpotsLayer from "../SpotLayers/SpotsLayer";
import { useSpotsStore } from "@/app/lib/spotStore";

function MapEvents() {
  const map = useMap();
  console.log("map", map);
  const { debouncedFetchSpots } = useSpotsStore();

  useEffect(() => {
    const handleMoveEnd = () => {
      debouncedFetchSpots(map.getBounds());
    };

    map.on("moveend", handleMoveEnd);
    debouncedFetchSpots(map.getBounds());

    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [map, debouncedFetchSpots]);

  return null;
}

function Map() {
  const isDetailed = false;

  const tileLayerUrl = isDetailed
    ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";

  // Define the bounds of Sweden
  const swedenBounds: L.LatLngBoundsExpression = [
    [55.34, 10.95], // Southwest corner (Smygehuk)
    [69.06, 24.15], // Northeast corner (Treriksröset)
  ];

  return (
    <MapContainer
      center={[62.0, 15.0]}
      zoom={5}
      className="w-full h-full cursor-pointer-map leaflet-grab"
      zoomControl={false}
      maxBounds={swedenBounds}
      maxBoundsViscosity={1.0} // Fully restricts panning beyond bounds
      minZoom={6}
      maxZoom={20}
      boundsOptions={{ padding: [50, 50] }}
    >
      <MapTileLayer tileLayerUrl={tileLayerUrl} />
      <SpotsLayer />
      <MapEvents />
    </MapContainer>
  );
}

export default Map;
