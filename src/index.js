import dotenv, { config } from 'dotenv';
import express from "express";
import cors from "cors";
import conectarDB from './services/db.js';
import routerGeneral from './routes/index.routes.js';
import { BASE_URL } from './config/config.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(routerGeneral);
conectarDB();

app.use('/uploads', express.static("public/img"));
app.use('/publicaciones', express.static("public/img/publicaciones"));

// 🔹 Escucha en todas las interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en ${BASE_URL}`);
});