const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// ⚠️ Esta línea DEBE estar después de cargar dotenv, pero antes de usar app
dotenv.config();

const app = express(); // ✅ Esta línea debe venir antes de cualquier uso de `app`

const authRoutes = require('./routes/authRoutes'); // Puede estar después también

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes); // ✅ Este uso de `app` ya es válido

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Conectado a MongoDB Atlas"))
.catch((error) => console.error("❌ Error al conectar a MongoDB:", error));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🎉 API funcionando correctamente');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

