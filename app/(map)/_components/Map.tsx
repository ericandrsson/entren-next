"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapInfoSheet from "./SpotCreationSheet";
import MapControls from "./controls/MapControls";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import SpotLayer from "./SpotLayer";
import SpotMarker from "./SpotMarker";
import SearchBar, { SearchResult } from "./SearchBar"; // Add this import
import { pb } from "@/lib/db";

interface Spot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  created: string;
  description?: string;
  tags?: string[];
  user: string;
  isVerified: boolean;
}

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
  const [markerPosition, setMarkerPosition] = useState<L.LatLng | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<SearchResult | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const { isOpen: isSidebarOpen } = useSidebarToggle();
  const [tempSpot, setTempSpot] = useState<Spot | null>(null);
  const [previewedSpot, setPreviewedSpot] = useState<Spot | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDetailed, setIsDetailed] = useState(false);
  const [prevMapState, setPrevMapState] = useState<{
    center: L.LatLng;
    zoom: number;
  } | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([62.0, 15.0]);
  const [zoom, setZoom] = useState(5);

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

      if (mapRef.current) {
        const map = mapRef.current;

        // Store the current map state before zooming in
        setPrevMapState({
          center: map.getCenter(),
          zoom: map.getZoom(),
        });

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

        setTimeout(() => {
          map.setView(e.latlng, 15);
          setTimeout(() => {
            setIsSheetOpen(true);
          }, 400);
        }, 400);
      }
    },
    [previewedSpot]
  );

  const handleSpotClick = (spot: Spot) => {
    console.log("Spot clicked:", spot);
    setPreviewedSpot(spot);
    // You can add more functionality here if needed
  };

  const handleSheetClose = () => {
    setTempSpot(null);
    setIsSheetOpen(false);

    // Revert to the previous map state when canceling
    if (prevMapState && mapRef.current) {
      mapRef.current.setView(prevMapState.center, prevMapState.zoom, {
        animate: true,
        duration: 0.5,
      });
    }
    setPrevMapState(null);
  };

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

  return (
    <div className="flex h-screen relative isolate">
      <div className="absolute inset-0 z-0">
        <SearchBar onSelectPlace={handleSelectPlace} />

        <MapContainer
          center={mapCenter}
          zoom={zoom}
          className="w-full h-full cursor-pointer-map leaflet-grab"
          ref={mapRef}
          zoomControl={false}
        >
          <TileLayer
            url={tileLayerUrl}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            noWrap={true}
          />
          <MapClickHandler onMapClick={handleMapClick} />
          <div ref={controlsRef}>
            <MapControls
              showListView={isSheetOpen}
              isDetailed={isDetailed}
              onDetailToggle={() => setIsDetailed(!isDetailed)}
            />
          </div>
          <SpotLayer
            key={refreshKey}
            isAdmin={false}
            user={null}
            onSpotClick={handleSpotClick}
          />
          {tempSpot && (
            <SpotMarker spot={tempSpot} isTemporary={true} categories={[]} />
          )}
          <MapCenterAdjuster center={mapCenter} zoom={zoom} />
        </MapContainer>
      </div>
      <div className="relative z-10 flex w-full h-full pointer-events-none">
        {/*<Sidebar /> */}
        <div className={`flex-1 ${isSidebarOpen ? "ml-72" : "ml-[90px]"}`}>
          <div className="pointer-events-auto">
            {/* Remove MapControls from here if it's not needed outside the map */}
          </div>
        </div>
      </div>
      <MapInfoSheet
        isOpen={isSheetOpen}
        onOpenChange={handleSheetClose}
        markerPosition={markerPosition}
        onSpotCreated={() => {
          handleSheetClose();
          refreshSpots();
        }}
        selectedPlace={selectedPlace}
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