console.log("📦 authRoutes.js cargado");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

require('dotenv').config();

// Ruta de registro
router.post('/register', async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  try {
    const existeUsuario = await User.findOne({ correo });
    if (existeUsuario) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const contraseñaHash = await bcrypt.hash(contraseña, salt);

    const nuevoUsuario = new User({
      nombre,
      correo,
      contraseña: contraseñaHash
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado con éxito' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});
// Ruta de login
// Login
router.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const usuario = await User.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado' });
    }

    const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esValida) {
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ mensaje: 'Login exitoso', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});


module.exports = router;
