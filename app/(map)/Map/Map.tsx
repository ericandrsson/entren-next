"use client";

import { useRef } from "react";
import L from "leaflet";
import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/lib/assets/MarkerCluster.css";
import "react-leaflet-cluster/lib/assets/MarkerCluster.Default.css";
import MapInterface from "../Interface/MapInterface";
import { useMapStore } from "./MapStore";
import MapTileLayer from "./MapTileLayer";
import SpotsLayer from "../SpotLayers/SpotsLayer";

function Map() {
  const mapRef = useRef<L.Map | null>(null);

  const { isDetailed, mapCenter, zoom } = useMapStore();

  const tileLayerUrl = isDetailed
    ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";

  return (
    <div className="flex h-screen relative isolate">
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          className="w-full h-full cursor-pointer-map leaflet-grab"
          ref={mapRef}
          zoomControl={false}
        >
          <MapTileLayer tileLayerUrl={tileLayerUrl} />
          <SpotsLayer />
        </MapContainer>
      </div>
      <MapInterface map={mapRef.current ?? undefined} />
    </div>
  );
}

export default Map;
