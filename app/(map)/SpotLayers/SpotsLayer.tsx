import MarkerClusterGroup from "react-leaflet-cluster";
import { useSpotsStore } from "@/app/lib/spotStore";
import VerifiedSpotsMarker from "./VerifiedSpotsMarker";

function SpotsLayer() {
  const spots = useSpotsStore((state) => state.spots);

  return (
    <>
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={60}
        spiderfyOnMaxZoom={false}
        disableClusteringAtZoom={16}
      >
        {spots.map((spot) => (
          <VerifiedSpotsMarker key={spot.id} spot={spot} onClick={() => {}} />
        ))}
      </MarkerClusterGroup>
    </>
  );
}

export default SpotsLayer;
