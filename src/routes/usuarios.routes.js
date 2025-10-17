import Router from "express";
import usuariosController from "../controllers/usuarios.controller.js"
import { verificarToken } from "../middlewares/auth.js";
import multer from "multer";
import path from "path";

//configuracion de multer
const storage = multer.diskStorage({
    destination: 'public/img/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
      req.body = file.fieldname + '-' + uniqueSuffix + ext;
    }
});

//aplicamos la configuracion
const upload = multer({ storage });

const routerUsuarios = Router();

routerUsuarios.get('/usuarios',usuariosController.getUsuarios);
routerUsuarios.get('/usuarios/perfil', verificarToken, usuariosController.getPerfil);
routerUsuarios.post('/usuarios/registro', usuariosController.registroUsuario);
routerUsuarios.post('/usuarios/login', usuariosController.loginUsuario);
routerUsuarios.delete('/usuarios/:id', usuariosController.eliminarUsuario);
routerUsuarios.put('/usuarios/:id', usuariosController.actualizarUsuario);
routerUsuarios.post('/usuarios/actualizarImagenDeUsuario', upload.single("imgPerf"), usuariosController.actualizarImagenDeUsuario);


export default routerUsuarios;