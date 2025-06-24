// Inicializa el mapa
const map = L.map('map').setView([4.6097, -74.0817], 13); // Bogotá como ejemplo

// Capa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Marcador al hacer clic
map.on('click', function(e) {
  L.marker(e.latlng).addTo(map)
    .bindPopup(`Lat: ${e.latlng.lat.toFixed(5)}, Lng: ${e.latlng.lng.toFixed(5)}`)
    .openPopup();
});
