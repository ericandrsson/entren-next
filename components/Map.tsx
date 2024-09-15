'use client'

import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function Map() {
  useEffect(() => {
    const map = L.map('map').setView([62.0, 15.0], 5)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    // Sweden boundaries
    const swedenBounds = L.latLngBounds(
      L.latLng(55.3617373725, 11.0273686052), // Southwest corner
      L.latLng(69.1062472602, 23.9033785336)  // Northeast corner
    )

    map.fitBounds(swedenBounds)

    return () => {
      map.remove()
    }
  }, [])

  return <div id="map" style={{ width: '100%', height: '100vh' }} />
}

export default Map