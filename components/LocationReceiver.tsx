"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSignalR } from "@/hooks/useSignalR";

const LocationMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
      Loading map...
    </div>
  ),
});

export default function LocationReceiver() {
  const [location, setLocation] = useState<{
    userName: string;
    lat: number;
    lon: number;
  } | null>(null);

  const { connection, error, isConnecting } = useSignalR(
    "https://tech-test.raintor.com/Hub"
  );

  useEffect(() => {
    if (!connection) return;

    const handler = (data: { userName: string; lat: number; lon: number }) => {
      setLocation(data);
    };

    connection.on("ReceiveLatLon", handler);
    return () => {
      connection.off("ReceiveLatLon", handler);
    };
  }, [connection]);

  return (
    <div className="p-6 border rounded-xl shadow-lg bg-white space-y-4">
      <h2 className="text-2xl font-semibold text-black">Location Receiver</h2>

      <div>
        {isConnecting ? (
          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Connecting...
          </span>
        ) : error ? (
          <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            {error}
          </span>
        ) : (
          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Connected
          </span>
        )}
      </div>

      {location ? (
        <div className="text-gray-700">
          <p className="font-medium">User: {location.userName}</p>
          <p>Latitude: {location.lat.toFixed(6)}</p>
          <p>Longitude: {location.lon.toFixed(6)}</p>
        </div>
      ) : (
        <div className="text-gray-500">Waiting for location data...</div>
      )}

      <div className="w-full h-96 rounded-lg border border-gray-300 overflow-hidden">
        <LocationMap location={location} />
      </div>
    </div>
  );
}
