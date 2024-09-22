"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/lib/assets/MarkerCluster.css";
import "react-leaflet-cluster/lib/assets/MarkerCluster.Default.css";
import MapTileLayer from "./MapTileLayer";
import SpotsLayer from "../SpotLayers/SpotsLayer";
import { useSpotsStore } from "@/app/lib/spotStore";
import MapControls from "./MapControls";

function MapEvents() {
  const map = useMap();
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

function MapWrapper({ children }: { children: React.ReactNode }) {
  const map = useMap();
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  useEffect(() => {
    setMapInstance(map);
  }, [map]);

  return (
    <>
      {children}
      <MapControls map={mapInstance} />
    </>
  );
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
      <MapWrapper>
        <MapTileLayer tileLayerUrl={tileLayerUrl} />
        <SpotsLayer />
        <MapEvents />
      </MapWrapper>
    </MapContainer>
  );
}

export default Map;
