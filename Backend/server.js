const express = require('express');
const cors = require('cors');
const conectarDB = require('./config/db');
const Producto = require('./models/Producto');
const Usuario = require('./models/Usuario');

const app = express();
const PORT = process.env.PORT || 3000;

conectarDB();

app.use(cors());
app.use(express.json());

// 1. OBTENER PRODUCTOS
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al solicitar el inventario.' });
    }
});

// 2. CREAR PRODUCTO
app.post('/api/productos', async (req, res) => {
    try {
        const nuevoProd = new Producto(req.body);
        await nuevoProd.save();
        res.status(201).json(nuevoProd);
    } catch (error) {
        res.status(400).json({ error: 'Estructura inválida.' });
    }
});

// 3. REGISTRAR USUARIO
app.post('/api/usuarios', async (req, res) => {
    try {
        const { correo } = req.body;
        const usuarioExistente = await Usuario.findOne({ correo });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
        }
        const nuevoUsuario = new Usuario(req.body);
        await nuevoUsuario.save();
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar usuario.' });
    }
});

// 4. LOGIN DE USUARIO
app.post('/api/usuarios/login', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        const usuario = await Usuario.findOne({ correo, contrasena });
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }
        res.status(200).json({ nombre: usuario.nombre, correo: usuario.correo });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
