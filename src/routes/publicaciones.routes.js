import {Router} from "express";
import publicacionesController from "../controllers/publicaciones.controller.js";
import multer from "multer";
import path from "path";

// Configuración de multer
const storage = multer.diskStorage({
  destination: "public/img/publicaciones",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const fileName = file.fieldname + "-" + uniqueSuffix + ext;
    cb(null, fileName); // ✅ solo define el nombre
  },
});

// Aplicamos la configuración
const upload = multer({ storage });

const routerPublicaciones = Router();

routerPublicaciones.get("/publicaciones", publicacionesController.getPublicaciones);
routerPublicaciones.get("/publicaciones/:id", publicacionesController.getPublicacion);
routerPublicaciones.get("/publicaciones/usuario/:id", publicacionesController.getPublicacionesUsuario);

// ✅ Ruta para crear publicación con imagen
routerPublicaciones.post(
  "/publicaciones/crearPublicacion",
  upload.single("img"),
  publicacionesController.postPublicacion
);

export default routerPublicaciones;