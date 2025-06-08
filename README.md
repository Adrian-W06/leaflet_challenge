# leaflet_challenge
module 15



 """# 🌍 Earthquake & Tectonic Plate Visualization

This project visualizes real-time earthquake data and tectonic plate boundaries on an interactive map using **Leaflet.js** and **D3.js**.

---

## 📁 File: `logic.js`

This JavaScript file builds an interactive map with dynamic overlays using Leaflet and public GeoJSON APIs.

---

## 🗺️ Map Features

### 🔹 Base Maps
- **Street View** and **Satellite View** (only Street is defined; Satellite is referenced but not implemented).
- Default base layer is OpenStreetMap tiles.

### 🔹 Overlays
- **Earthquake Data**: Pulled from the USGS GeoJSON feed (past 7 days).
- **Tectonic Plates**: Pulled from GitHub GeoJSON file (PB2002).

---

## 🔧 Key Functionalities

### 1. Tile Layers

```js
let basemap = L.tileLayer(...);
let street = L.tileLayer(...);  // Optional second base layer
