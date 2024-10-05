import { useState, useCallback } from 'react';
import { LatLng, Map as LeafletMap } from 'leaflet';

interface MapState {
  center: LatLng;
  zoom: number;
}

export function useMapZoom(mapRef: React.RefObject<LeafletMap | null>) {
  const [prevMapState, setPrevMapState] = useState<MapState | null>(null);

  const zoomToSpot = useCallback((latlng: LatLng) => {
    if (mapRef.current) {
      const map = mapRef.current;
      setPrevMapState({
        center: map.getCenter(),
        zoom: map.getZoom(),
      });

      map.setView(latlng, 18, {
        animate: true,
        duration: 0.5,
      });
    }
  }, [mapRef]);

  const resetZoom = useCallback(() => {
    if (mapRef.current && prevMapState) {
      mapRef.current.setView(prevMapState.center, prevMapState.zoom, {
        animate: true,
        duration: 0.5,
      });
      setPrevMapState(null);
    }
  }, [mapRef, prevMapState]);

  return { zoomToSpot, resetZoom };
}