import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Conectado (mongod-montesco.service): ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error al conectar con mongod-montesco.service: ${error.message}`);
        console.warn('Asegurate de que el servicio este corriendo: sudo systemctl start mongod-montesco.service');
        console.warn('El backend seguira corriendo sin base de datos (Usando MOCK DATA para el catalogo).');
    }
};

export default connectDB;
