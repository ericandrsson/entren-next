"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/lib/assets/MarkerCluster.css";
import "react-leaflet-cluster/lib/assets/MarkerCluster.Default.css";
import MapControls from "../Interface/MapControls";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import VerifiedSpotsLayer from "../Spots/VerifiedSpotsLayer";
import SpotMarker from "../Spots/SpotMarker";
import { pb } from "@/lib/db";
import { useMapZoom } from "@/hooks/useMapZoom";
import UnverifiedSpotsLayer from "../Spots/UnverifiedSpotsLayer";
import { SearchResult, Spot, UnverifiedNode } from "@/types";

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (e: L.LeafletMouseEvent) => void;
}) {
  useMapEvents({
    click: onMapClick,
  });
  return null;
}

function Map() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const [tempSpot, setTempSpot] = useState<Spot | null>(null);
  const [previewedSpot, setPreviewedSpot] = useState<Spot | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDetailed, setIsDetailed] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([62.0, 15.0]);
  const [zoom, setZoom] = useState(5);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const { zoomToSpot, resetZoom } = useMapZoom(mapRef);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [currentMode, setCurrentMode] = useState<"view" | "contribute">("view");

  const handleMapCreated = (map: L.Map) => {
    if (!mapInstance) {
      setMapInstance(map);
    }
  };

  const handleMapClick = useCallback(
    (e: L.LeafletMouseEvent) => {
      if (
        controlsRef.current &&
        controlsRef.current.contains(e.originalEvent.target as Node)
      ) {
        return;
      }

      if (previewedSpot) {
        setPreviewedSpot(null);
        return;
      }

      const newTempSpot = {
        id: "temp",
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        name: "New Spot",
        category: "",
        created: new Date().toISOString(),
        isVerified: false,
        user: "",
      };

      setTempSpot(newTempSpot);
      setMarkerPosition(e.latlng);
      zoomToSpot(e.latlng);
      setIsSheetOpen(true);
    },
    [previewedSpot, zoomToSpot]
  );

  const handleSpotClick = useCallback(
    (spot: Spot) => {
      console.log("Spot clicked:", spot);
      setSelectedSpot(spot);
      zoomToSpot(L.latLng(spot.lat, spot.lng));
    },
    [zoomToSpot]
  );

  const handleSpotDetailsClose = useCallback(() => {
    resetZoom();
  }, [resetZoom]);

  const refreshSpots = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const tileLayerUrl = isDetailed
    ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";

  const handleSelectPlace = useCallback(async (result: SearchResult) => {
    try {
      const existingSpot = await pb
        .collection("spots")
        .getFirstListItem(`data.osm_id=${result.osm_id}`);

      console.log("Existing spot:", existingSpot);
      if (existingSpot) {
        setMapCenter([existingSpot.lat, existingSpot.lng]);
        setZoom(18);
        setPreviewedSpot(existingSpot);
      } else {
        const newCenter: [number, number] = [
          parseFloat(result.lat),
          parseFloat(result.lon),
        ];
        setMapCenter(newCenter);
        setZoom(18);
        setMarkerPosition(L.latLng(newCenter[0], newCenter[1]));
        setSelectedPlace(result);
        setIsSheetOpen(true);
      }
    } catch (error) {
      const newCenter: [number, number] = [
        parseFloat(result.lat),
        parseFloat(result.lon),
      ];
      setMapCenter(newCenter);
      setZoom(18);
      setMarkerPosition(L.latLng(newCenter[0], newCenter[1]));
      setSelectedPlace(result);
      setIsSheetOpen(true);
    }
  }, []);

  const handleFilterChange = useCallback((filters: any) => {
    // Implement filter logic here
    console.log("Filters changed:", filters);
    // You might want to update the SpotLayer or fetch new data based on filters
  }, []);

  const handleModeChange = (mode: "view" | "contribute") => {
    setCurrentMode(mode);
    // You might want to add logic here to change the visible layer
    // or fetch different data based on the mode
  };

  const handleUnverifiedNodeClick = (node: UnverifiedNode) => {
    console.log("Unverified node clicked:", node);
    // Implement logic to show contribution form for this node
  };

  return (
    <div className="flex h-screen relative isolate">
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          className="w-full h-full cursor-pointer-map leaflet-grab"
          ref={mapRef}
          zoomControl={false}
          whenReady={() => {
            if (mapRef.current) {
              handleMapCreated(mapRef.current);
            }
          }}
        >
          <TileLayer
            url={tileLayerUrl}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            noWrap={true}
          />
          <MapClickHandler onMapClick={handleMapClick} />
          {currentMode === "view" && (
            <VerifiedSpotsLayer
              key={refreshKey}
              isAdmin={false}
              user={null}
              onSpotClick={handleSpotClick}
            />
          )}
          {currentMode === "contribute" && (
            <UnverifiedSpotsLayer onNodeClick={handleUnverifiedNodeClick} />
          )}
          {tempSpot && (
            <SpotMarker spot={tempSpot} isTemporary={true} categories={[]} />
          )}
          <MapCenterAdjuster center={mapCenter} zoom={zoom} />
        </MapContainer>
      </div>
      <MapControls
        map={mapInstance}
        showListView={isSheetOpen}
        isDetailed={isDetailed}
        onDetailToggle={() => setIsDetailed(!isDetailed)}
        onSelectPlace={handleSelectPlace}
        selectedSpot={selectedSpot}
        onCloseSpotDetails={() => {
          setSelectedSpot(null);
          resetZoom();
        }}
        onFilterChange={handleFilterChange}
        onModeChange={handleModeChange}
        currentMode={currentMode}
      />
    </div>
  );
}

function MapCenterAdjuster({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default Map;
