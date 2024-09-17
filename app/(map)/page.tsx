import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import MapExplorerContainer from './_components/explorer/MapExplorerContainer';
import { UnverifiedNode } from './_components/UnverifiedNodesLayer';

const Map = dynamic(() => import('./_components/Map'), { ssr: false });

export default function MapPage() {
  const [selectedUnverifiedNode, setSelectedUnverifiedNode] = useState<UnverifiedNode | null>(null);

  const handleUnverifiedNodeClick = useCallback((node: UnverifiedNode | null) => {
    console.log("MapPage: Unverified node clicked", node);
    setSelectedUnverifiedNode(node);
  }, []);

  console.log("MapPage: Rendering with selectedUnverifiedNode", selectedUnverifiedNode);

  return (
    <div className="relative w-full h-full">
      <Map onUnverifiedNodeClick={handleUnverifiedNodeClick}>
        {/* UnverifiedNodesLayer is now rendered inside Map component */}
      </Map>
      <MapExplorerContainer
        onUnverifiedNodeClick={handleUnverifiedNodeClick}
        selectedUnverifiedNode={selectedUnverifiedNode}
        onSelectPlace={() => {}}
        selectedSpot={null}
        onCloseSpotDetails={() => {}}
        onFilterChange={() => {}}
        onSpotCreated={() => {}}
      />
    </div>
  );
}