const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    telefono: { type: String, required: true },
    contrasena: { type: String, required: true }
}, { versionKey: false });

module.exports = mongoose.model('Usuario', UsuarioSchema);