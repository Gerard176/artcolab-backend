import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const verificarToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Acceso denegado: falta token" });
  }

  // El header debe tener formato: "Bearer <token>"
  const token = authHeader.split(" ")[1]; // Toma la segunda parte

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const verificado = jwt.verify(token, config.JWT_SECRET);
    req.usuario = verificado; // Guarda la info decodificada
    next(); // Continúa al controlador
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};