// Inicializa el mapa
const map = L.map('map').setView([4.6097, -74.0817], 13); // Bogotá como ejemplo
// Mostrar el modal de login al iniciar
document.getElementById('loginModal').style.display = 'block';
document.getElementById('overlay').style.display = 'block';

fetch("data_world.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    paisSelect.innerHTML = '<option value="">Selecciona un país</option>';
    data.forEach(pais => {
      const option = document.createElement("option");
      option.value = pais.id;
      option.textContent = pais.name;
      paisSelect.appendChild(option);
    });
  })
  .catch(error => {
    console.error("Error al cargar data_world.json:", error);
  });

  
// Crear el mapa
const map = L.map('map').setView([4.6097, -74.0818], 13); // Bogotá

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Función login
function login() {
  const correo = document.getElementById('correo').value;
  const contraseña = document.getElementById('contraseña').value;

  fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ correo, contraseña })
  })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
      } else {
        document.getElementById('mensaje').innerText = data.mensaje || 'Error';
      }
    })
    .catch(error => {
      console.error(error);
      document.getElementById('mensaje').innerText = 'Error del servidor';
    });
}

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