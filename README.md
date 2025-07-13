# Assessment 02

1. Clone the repo:

```bash
git clone git@github.com:jobairalsarkar1/assessment02.git
cd assessment02
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

<br/>
<br/>
<br/>
<br/>


# Task 02: Real-Time Location Sharing

This project is a real-time location sharing app built with **Next.js 15**, **SignalR**, and **Leaflet.js**. It features two main components: a **Location Sender** that shares a user’s location in real time, and a **Location Receiver** that listens for and displays those updates on a map.

---

## Features

* **Real-time Communication**: Powered by SignalR over WebSockets.
* **Automatic Reconnection**: Attempts to reconnect if the connection drops.
* **Live GPS Simulation**: Sends real or simulated geolocation every second.
* **Interactive Map**: Uses Leaflet.js to visualize incoming coordinates.
* **Responsive UI**: Clean layout with live connection status and location display.

---

## Components Overview

### 1. `useSignalR.ts`

Custom React hook that sets up a SignalR connection to a specified URL with support for automatic reconnection and error tracking.

### 2. `LocationSender.tsx`

Sends the user's real (or simulated) location to the server every second using the SignalR connection. Displays status (connected, connecting, error) and allows toggling live tracking.

### 3. `LocationReceiver.tsx`

Listens for `ReceiveLatLon` events from the server and updates the map and UI with the latest user location.

### 4. `LeafletMap.tsx`

Renders an interactive map using Leaflet. When a new location is received, it animates to that position and shows a marker with the user's name.

---


## Notes

* The server SignalR hub URL used is: `https://tech-test.raintor.com/Hub`
* GPS coordinates are simulated if actual location permission is denied.
* The map is only rendered on the client side to prevent SSR issues.

---

<br/>
<br/>
<br/>

# Task 03: Infinite User Feed with Virtualization

This project is a **Next.js 15 app** that displays a **virtualized, infinitely-scrollable list of users**. It integrates powerful tools like **React Query**, **TanStack Virtual**, and **Next.js App Router** to deliver a high-performance, modern frontend experience.

---

## 1. Features

1. Infinite Scrolling: New users are fetched and appended as you scroll.
2. Virtualization: Improves performance by rendering only visible DOM elements.
3. Fallback Mechanism: Just in case API or proxy fails.
4. User Interface: Each card shows name, title, university, email, phone, and profile picture.
5. Retry Mechanism: Graceful error UI with retry button.

---

## 2. How It Works

### Providers

Wraps the app with React Query's `QueryClientProvider` so that it can manage server state.

### Layout

Sets up global styles and fonts, and wraps everything inside the `Providers` component.

### UserFeed

* Uses `useInfiniteQuery` to fetch paginated users.
* Uses `useVirtualizer` to render only visible cards.
* Automatically fetches more as you scroll.
* Handles loading, error, and success states.

### UserCard

Simple styled card layout to show user info.

---

## 3. Virtualization

Only renders what's visible in the scrollable area. This:

* Speeds up rendering
* Reduces DOM nodes
* Makes large lists perform better

---

## 4. Why Proxy Is Used in Development

In development, direct API calls can fail due to **CORS issues**. To avoid that, a proxy is used:

```ts
const proxyUrl = "https://cors-anywhere.herokuapp.com/";
```

If the proxy fails (e.g., rate-limited or disabled), the app falls back to mock data.

---

## 5. API Behavior

Production uses:

```ts
fetch(`/api/users?skip=${skip}`);
```

Development uses proxy + fallback mock data:

```ts
fetch(proxyUrl + targetUrl);
```

---
