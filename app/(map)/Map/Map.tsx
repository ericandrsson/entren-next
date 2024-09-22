"use client";

import { useRef } from "react";
import L from "leaflet";
import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/lib/assets/MarkerCluster.css";
import "react-leaflet-cluster/lib/assets/MarkerCluster.Default.css";
import { useMapStore } from "./MapStore";
import MapTileLayer from "./MapTileLayer";
import SpotsLayer from "../SpotLayers/SpotsLayer";

function Map() {
  const mapRef = useRef<L.Map | null>(null);

  const { isDetailed, mapCenter, zoom } = useMapStore();

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
      center={mapCenter}
      zoom={zoom}
      className="w-full h-full"
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
