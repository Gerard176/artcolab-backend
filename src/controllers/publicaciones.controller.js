import { publicaciones_URL } from "../config/config.js";
import { uploads_URL } from "../config/config.js";
import publicacionModel from "../models/publicaciones.model.js";
import mongoose from "mongoose";


export const postPublicacion = async (req, res) => {
  const { idUsuario, nombre, descripcion, categoria } = req.body;

  // Nombre del archivo (solo este se guarda en la base de datos)
  const fileName = req.file.filename;

  // URL completa que se enviará al frontend
  const imageUrl = `${publicaciones_URL}${fileName}`;

  console.log(req.body);

  try {
    const publicacion = new publicacionModel({
      idUsuario: new mongoose.Types.ObjectId(idUsuario),
      nombre,
      img: fileName, // Solo guardamos el nombre del archivo
      descripcion,
      categoria,
    });

    await publicacion.save();

    if (!publicacion) {
      return res.status(404).json({ error: "Publicación no creada" });
    }

    // Enviamos la publicación al frontend con la URL completa
    res.status(200).json({
      ...publicacion.toObject(),
      img: imageUrl, // Reemplazamos el nombre por la URL completa en la respuesta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error interno del servidor: " + error,
    });
  }
};

// 🟦 Obtener todas las publicaciones
export const getPublicaciones = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    const categoria = req.query.categoria;
    const sortField = req.query.sortField || "createdAt";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    const filtro = {};
    if (categoria) filtro.categoria = categoria;

    const publicaciones = await publicacionModel
      .find(filtro)
      .populate("idUsuario", "nombre imgPerf nickName") // incluir usuario
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    // 🟩 Construir URLs completas
    const publicacionesConURL = publicaciones.map((pub) => {
      const imgUrl = pub.img ? `${publicaciones_URL}${pub.img}` : null;

      // también convertir la imagen del usuario si existe
      const usuario = pub.idUsuario
        ? {
            ...pub.idUsuario.toObject(),
            imgPerf: pub.idUsuario.imgPerf
              ? `${uploads_URL}${pub.idUsuario.imgPerf}`
              : null,
          }
        : null;

      return {
        ...pub.toObject(),
        img: imgUrl,
        idUsuario: usuario,
      };
    });

    res.status(200).json({ publicaciones: publicacionesConURL });
  } catch (error) {
    console.error("❌ Error al obtener publicaciones:", error);
    res.status(500).json({ error: "Error al obtener las publicaciones" });
  }
};


// 🟦 Obtener una sola publicación
export const getPublicacion = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID no válido" });
    }

    const publicacion = await publicacionModel
      .findById(id)
      .populate("idUsuario", "nombre imgPerf nickName");

    if (!publicacion) {
      return res.status(404).json({ error: "Obra no encontrada" });
    }

    // 🟩 Construir URLs completas
    const imgUrl = publicacion.img
      ? `${publicaciones_URL}${publicacion.img}`
      : null;

    const usuario = publicacion.idUsuario
      ? {
          ...publicacion.idUsuario.toObject(),
          imgPerf: publicacion.idUsuario.imgPerf
            ? `${uploads_URL}${publicacion.idUsuario.imgPerf}`
            : null,
        }
      : null;

    const publicacionConURL = {
      ...publicacion.toObject(),
      img: imgUrl,
      idUsuario: usuario,
    };

    res.status(200).json(publicacionConURL);
  } catch (error) {
    console.error("❌ Error al obtener la publicación:", error);
    res.status(500).json({
      error: "Error interno del servidor: " + error.message,
    });
  }
};
// Obtener las publicaciones de un usuario en específico
export const getPublicacionesUsuario = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "ID de usuario no válido" });
    }

    // 🟩 Obtiene las publicaciones desde la base de datos
    const publicaciones = await publicacionModel.find({ idUsuario: userId });

    // 🟦 Mapea los resultados para agregar la URL completa al campo img
    const publicacionesConURL = publicaciones.map((pub) => {
      // Si img existe y no es ya una URL, la construimos
      const imgUrl = pub.img ? `${publicaciones_URL}${pub.img}` : null;

      return {
        ...pub.toObject(),
        img: imgUrl, // URL completa para el frontend
      };
    });

    res.status(200).json({ publicaciones: publicacionesConURL });
  } catch (error) {
    console.error("❌ Error al obtener publicaciones del usuario:", error);
    res.status(500).json({ error: "Error al obtener publicaciones del usuario" });
  }
};



export default {
    getPublicaciones,
    getPublicacionesUsuario,
    getPublicacion,
    postPublicacion
}