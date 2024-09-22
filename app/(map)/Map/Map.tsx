"use client";

import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import { MapContainer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/lib/assets/MarkerCluster.css";
import "react-leaflet-cluster/lib/assets/MarkerCluster.Default.css";
import MapTileLayer from "./MapTileLayer";
import SpotsLayer from "../SpotLayers/SpotsLayer";
import { useSpotsStore } from "@/app/lib/spotStore";
import MapControls from "./MapControls";

function MapEvents() {
  const map = useMap();
  const { debouncedFetchSpots, selectedSpot, setSelectedSpot } = useSpotsStore();

  useMapEvents({
    moveend: () => {
      debouncedFetchSpots(map.getBounds());
    },
    click: () => {
      setSelectedSpot(null);
    },
  });

  useEffect(() => {
    if (selectedSpot) {
      map.setView([selectedSpot.lat, selectedSpot.lng], 16, { animate: true });
    }
  }, [selectedSpot, map]);

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
  const mapRef = useRef<L.Map>(null);
  const { mapView } = useSpotsStore();

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
      ref={mapRef}
      center={mapView.center}
      zoom={mapView.zoom}
      className="w-full h-full cursor-pointer-map leaflet-grab"
      zoomControl={false}
      maxBounds={swedenBounds}
      maxBoundsViscosity={1.0}
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

export default React.memo(Map);
