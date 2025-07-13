"use client";

import { useSignalR } from "@/hooks/useSignalR";
import { useEffect, useState } from "react";

export default function LocationSender({ userName }: { userName: string }) {
  const [lat, setLat] = useState(51.505);
  const [lon, setLon] = useState(-0.09);
  const [isTracking, setIsTracking] = useState(false);
  const { connection, error, isConnecting } = useSignalR(
    "https://tech-test.raintor.com/Hub"
  );

  const simulateLocation = () => {
    setLat((prev) => prev + (Math.random() * 0.01 - 0.005));
    setLon((prev) => prev + (Math.random() * 0.01 - 0.005));
  };

  useEffect(() => {
    if (!isTracking || !connection) return;

    const interval = setInterval(() => {
      simulateLocation();
      connection
        .invoke("SendLatLon", lat, lon, userName)
        .catch((err) => console.error("Send failed:", err));
    }, 1000);

    return () => clearInterval(interval);
  }, [isTracking, connection, lat, lon, userName]);

  const startTracking = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
          setIsTracking(true);
        },
        () => setIsTracking(true) // Fallback to simulated data
      );
    } else {
      setIsTracking(true);
    }
  };

  return (
    <div className="p-6 border rounded-xl shadow-lg bg-white space-y-4">
      <h2 className="text-2xl font-semibold text-black">Location Sender</h2>

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

      <div className="text-gray-700">
        <p>Latitude: {lat.toFixed(6)}</p>
        <p>Longitude: {lon.toFixed(6)}</p>
      </div>

      {!isTracking ? (
        <button
          onClick={startTracking}
          disabled={!!error || isConnecting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 transition-colors"
        >
          Start Sharing
        </button>
      ) : (
        <button
          onClick={() => setIsTracking(false)}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Stop Sharing
        </button>
      )}
    </div>
  );
}
