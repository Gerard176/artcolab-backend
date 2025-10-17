import Router from "express";
import favoritosController from "../controllers/favoritos.controller.js";

const routerFavoritos = Router();

routerFavoritos.get("/favoritos/:idUsuario", favoritosController.getFavorito);
routerFavoritos.post("/favoritos/add/", favoritosController.addItemFavorito);
routerFavoritos.delete("/favoritos/delete/:id", favoritosController.deleteItemFavorito);


export default routerFavoritos;