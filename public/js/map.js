  // Initialize map (centered on India initially)
var map = L.map("map").setView([20.5937, 78.9629], 5);

// Add OpenStreetMap layer
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Keep one marker variable to reuse later
var marker;

// Function: find city coordinates from name (Forward Geocoding)
async function locateCity(cityName) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "MyLeafletApp/1.0 (example@gmail.com)" },
  });
  const data = await res.json();

  if (data.length === 0) {
    alert("City not found!");
    return;
  }

  const lat = parseFloat(data[0].lat);
  const lon = parseFloat(data[0].lon);

  // Move map to city
  map.setView([lat, lon], 12);

  // Remove old marker if it exists
  if (marker) map.removeLayer(marker);

  // Add new marker
  marker = L.marker([lat, lon]).addTo(map)
    .bindPopup(`<b>${cityName}</b><br>Latitude: ${lat.toFixed(5)}<br>Longitude: ${lon.toFixed(5)}`)
    .openPopup();
}

locateCity("jodhpur");