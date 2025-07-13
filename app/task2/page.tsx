"use client";

import LocationReceiver from "@/components/LocationReceiver";
import LocationSender from "@/components/LocationSender";

export default function Task2() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-black text-center mb-8">
        Task 02: Real-Time Location Sharing
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <LocationSender userName="rayanrafi050@gmail.com" />
        <LocationReceiver />
      </div>
    </main>
  );
}
