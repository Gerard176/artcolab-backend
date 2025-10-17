import Router from "express";
import routerPublicaciones from "./publicaciones.routes.js";
import routerUsuarios from "./usuarios.routes.js";
import routerCarrito from "./carrito.routes.js";
import routerResenas from "./reseñas.routes.js";
import routerFavoritos from "./favoritos.routes.js";

const routerGeneral = Router();

routerGeneral.use('/api', routerPublicaciones);
routerGeneral.use('/api', routerUsuarios);
routerGeneral.use('/api', routerCarrito);
routerGeneral.use('/api', routerResenas);
routerGeneral.use('/api', routerFavoritos);




export default routerGeneral;