import Router from "express";
import reseñaController from "../controllers/reseña.controller.js";

const routerResenas = Router();

routerResenas.get("/resenas/:id", reseñaController.getResenas);
routerResenas.post("/resenas/postear", reseñaController.postResena);
routerResenas.delete("/resenas/eliminar", reseñaController.deleteResena);
routerResenas.put("/resenas/editar", reseñaController.editarResena);



export default routerResenas;