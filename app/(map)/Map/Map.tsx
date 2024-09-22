"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/lib/assets/MarkerCluster.css";
import "react-leaflet-cluster/lib/assets/MarkerCluster.Default.css";
import MapTileLayer from "./MapTileLayer";
import SpotsLayer from "../SpotLayers/SpotsLayer";
import { useSpotsStore } from "@/app/lib/spotStore";

function Map() {
  const mapRef = useRef<L.Map | null>(null);
  const isDetailed = false;

  const { debouncedFetchSpots } = useSpotsStore();

  useEffect(() => {
    const mapInstance = mapRef.current;

    const handleMoveEnd = () => {
      if (mapInstance) {
        debouncedFetchSpots(mapInstance.getBounds());
      }
    };

    if (mapInstance) {
      mapInstance.on("moveend", handleMoveEnd);
      debouncedFetchSpots(mapInstance.getBounds());
    }

    return () => {
      if (mapInstance) {
        mapInstance.off("moveend", handleMoveEnd);
      }
      debouncedFetchSpots.cancel();
    };
  }, [debouncedFetchSpots]);
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
      ref={mapRef}
      zoomControl={false}
      maxBounds={swedenBounds}
      maxBoundsViscosity={1.0} // Fully restricts panning beyond bounds
      minZoom={6}
      maxZoom={20}
      boundsOptions={{ padding: [50, 50] }}
    >
      <MapTileLayer tileLayerUrl={tileLayerUrl} />
      <SpotsLayer />
    </MapContainer>
  );
}

export default Map;
