// TODO TU SCRIPT AQUÍ ADENTRO
document.addEventListener("DOMContentLoaded", () => {
  


// Obtener referencias a los selectores
const paisSelect = document.getElementById("pais");
const deptSelect = document.getElementById("departamento");
const ciudadSelect = document.getElementById("ciudad");
const botonBuscar = document.getElementById("buscarUbicacion");

// Crear el mapa centrado en Bogotá
const map = L.map('route_map').setView([4.6477, -74.0842], 12);

// Cargar mapa base
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Añadir marcadores
L.marker([4.68779, -74.16166]).addTo(map).bindPopup("Point 1").openPopup();
L.marker([4.60417, -74.09042]).addTo(map).bindPopup("Point 2");
L.marker([4.61648, -74.11952]).addTo(map).bindPopup("Point 3");

// Dibujar ruta
const ruta = [
  [4.68779, -74.16166],
  [4.60417, -74.09042],
  [4.61648, -74.11952]
];
L.polyline(ruta, {
  color: 'blue',
  weight: 4,
  opacity: 0.7,
  smoothFactor: 1
}).addTo(map);

// Variable global para almacenar datos
let data = [];

// Cargar datos JSON
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

// Cambiar país
paisSelect.addEventListener("change", () => {
  const paisId = parseInt(paisSelect.value);
  const pais = data.find(p => p.id === paisId);

  deptSelect.innerHTML = '<option value="">Selecciona un departamento</option>';
  ciudadSelect.innerHTML = '<option value="">Selecciona una ciudad</option>';

  if (pais && pais.states && pais.states.length > 0) {
    const tipo = pais.states[0].type?.toLowerCase();
    const traducciones = {
      department: "Departamento",
      province: "Provincia",
      state: "Estado",
      region: "Región",
      territory: "Territorio",
      district: "Distrito"
    };
    const nombreEscala = traducciones[tipo] || "División";
    document.querySelector("label[for='departamento']").textContent = nombreEscala;

    pais.states.forEach(dept => {
      const option = document.createElement("option");
      option.value = dept.id;
      option.textContent = dept.name;
      deptSelect.appendChild(option);
    });
  }
});

// Cambiar departamento
deptSelect.addEventListener("change", () => {
  const paisId = parseInt(paisSelect.value);
  const deptId = parseInt(deptSelect.value);
  const pais = data.find(p => p.id === paisId);
  const estado = pais?.states.find(s => s.id === deptId);

  ciudadSelect.innerHTML = '<option value="">Selecciona una ciudad</option>';

  if (estado && estado.cities) {
    estado.cities.forEach(ciudad => {
      const option = document.createElement("option");
      option.value = ciudad.id;
      option.textContent = ciudad.name;
      ciudadSelect.appendChild(option);
    });
  }
});

// Buscar ciudad
botonBuscar.addEventListener("click", () => {
  const paisId = parseInt(paisSelect.value);
  const deptId = parseInt(deptSelect.value);
  const ciudadId = parseInt(ciudadSelect.value);
  const pais = data.find(p => p.id === paisId);
  if (!pais || !pais.states) return;

  let ciudad = null;

  if (deptId && ciudadId) {
    const dept = pais.states.find(d => d.id === deptId);
    ciudad = dept?.cities.find(c => c.id === ciudadId);
  } else {
    for (const dept of pais.states) {
      ciudad = dept.cities?.find(c => c.id === ciudadId);
      if (ciudad) break;
    }
  }

  if (!ciudad) {
    alert("No se encontró la ciudad o faltan datos.");
    return;
  }

  const lat = parseFloat(ciudad.latitude);
  const lon = parseFloat(ciudad.longitude);
  if (!isNaN(lat) && !isNaN(lon)) {
    map.setView([lat, lon], 13);
    L.popup()
      .setLatLng([lat, lon])
      .setContent(`<b>${ciudad.name}</b>`)
      .openOn(map);
  } else {
    alert("La ciudad seleccionada no tiene coordenadas válidas.");
  }
});

// ====================== LOGIN =========================

document.getElementById("abrirLogin").addEventListener("click", () => {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("loginModal").style.display = "block";
});

document.getElementById("mostrarRegistro").addEventListener("click", (e) => {
  e.preventDefault();
  alert("Aquí se abriría el formulario de registro");
});

function login() {
  const correo = document.getElementById("correo").value;
  const contraseña = document.getElementById("contraseña").value;

  fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, contraseña }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        document.getElementById("mensaje").textContent = "✔️ Login exitoso";
        document.getElementById("loginModal").style.display = "none";
        document.getElementById("overlay").style.display = "none";
        localStorage.setItem("token", data.token);
      } else {
        document.getElementById("mensaje").textContent = "❌ " + data.mensaje;
      }
    })
    .catch(err => {
      console.error("Error:", err);
      document.getElementById("mensaje").textContent = "❌ Error de conexión";
    });
}

// Cerrar modal
function cerrarModal() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("loginModal").style.display = "none";
}

});