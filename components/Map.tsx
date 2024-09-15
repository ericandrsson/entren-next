'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Drawer } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

function Map() {
  const mapRef = useRef<L.Map | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [markerPosition, setMarkerPosition] = useState<L.LatLng | null>(null)

  useEffect(() => {
    if (mapRef.current !== null) return

    // Sweden's bounding box
    const swedenBounds = L.latLngBounds(
      L.latLng(55.3617373725, 11.0273686052), // Southwest corner
      L.latLng(69.1062472602, 23.9033785336)  // Northeast corner
    )

    mapRef.current = L.map('map', {
      center: swedenBounds.getCenter(),
      zoom: 5,
      maxBounds: swedenBounds,
      maxBoundsViscosity: 1.0
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      bounds: swedenBounds
    }).addTo(mapRef.current)

    // Add click event to the map
    mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
      if (mapRef.current) {
        // Remove existing marker if any
        mapRef.current.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            mapRef.current?.removeLayer(layer)
          }
        })

        // Add new marker
        const marker = L.marker(e.latlng, {
          icon: L.divIcon({
            html: '📍',
            iconSize: [25, 25],
            className: 'map-pin'
          })
        }).addTo(mapRef.current)

        setMarkerPosition(e.latlng)
        setIsDrawerOpen(true)
      }
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  return (
    <>
      <div id="map" className="w-full h-screen" />
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Add Information</h2>
          {markerPosition && (
            <p>
              Latitude: {markerPosition.lat.toFixed(6)}, 
              Longitude: {markerPosition.lng.toFixed(6)}
            </p>
          )}
          {/* Add more input fields here as needed */}
          <Button className="mt-4" onClick={() => setIsDrawerOpen(false)}>Close</Button>
        </div>
      </Drawer>
    </>
  )
}

export default Map