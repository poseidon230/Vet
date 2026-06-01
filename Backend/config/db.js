const mongoose = require('mongoose');

// Tu cadena de conexión limpia a MongoDB Atlas
const MONGO_URI = 'mongodb+srv://sebrmffctpa_db_user:broly@cluster0.hcpuroc.mongodb.net/VetCareDB?appName=Cluster0';

const conectarDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('🚀 Conectado exitosamente a MongoDB Atlas (Clúster de Veterinaria)');
    } catch (error) {
        console.error('❌ Error crítico en la conexión a la Base de Datos:', error.message);
        process.exit(1);
    }
};

module.exports = conectarDB;