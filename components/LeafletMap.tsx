"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LeafletMapProps {
  location: {
    userName: string;
    lat: number;
    lon: number;
  } | null;
}

const LeafletMap = ({ location }: LeafletMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([0, 0], 1);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  // Update marker
  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.flyTo([location.lat, location.lon], 15);
      markerRef.current?.remove();
      markerRef.current = L.marker([location.lat, location.lon])
        .addTo(mapRef.current)
        .bindPopup(`<b>${location.userName}</b>`);
    }
  }, [location]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
};

export default LeafletMap;
