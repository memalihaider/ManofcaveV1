'use client'

import { useEffect, useState, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix for default marker icon in Leaflet with Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface LocationPickerProps {
  lat: number
  lng: number
  onChange: (lat: number, lng: number, address: string) => void
}

function MapContent({ lat, lng, onChange }: LocationPickerProps) {
  const map = useMap()

  // Update map center when props change
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom())
    }
  }, [lat, lng, map])

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      )
      const data = await response.json()
      const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      onChange(lat, lng, address)
    } catch (error) {
      console.error('Error reverse geocoding:', error)
      onChange(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`)
    }
  }, [onChange])

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      reverseGeocode(lat, lng)
    },
  })

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={icon} />
    </>
  )
}

export default function LocationPicker({ lat, lng, onChange }: LocationPickerProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="h-[300px] w-full bg-slate-100 rounded-xl flex items-center justify-center border border-border">
        <p className="text-sm text-muted-foreground">Initializing Map...</p>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full rounded-xl overflow-hidden border border-border shadow-inner relative z-0">
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <MapContent lat={lat} lng={lng} onChange={onChange} />
      </MapContainer>
      <div className="absolute bottom-2 left-2 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border text-[10px] font-bold text-secondary shadow-sm">
        Click on map to set location
      </div>
    </div>
  )
}
