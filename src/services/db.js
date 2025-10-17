import mongoose from "mongoose";
import config from "../config/config.js";

export const conectarDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI );
        console.log('Base de datos conectada');
    } catch (error) {
        console.error('Error al conectar la BD', error);
        process.exit(1);
    }
};

export default conectarDB;