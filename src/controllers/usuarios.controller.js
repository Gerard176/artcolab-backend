import usuarioModel from "../models/usuarios.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import bcrypt from "bcryptjs";
import { uploads_URL } from "../config/config.js";
export const getUsuarios = async (req, res) => {
  let data = await usuarioModel.find();
  res.status(200).json({
    msg: "usuarios encontrados",
    data: data,
  });
};

export const getPerfil = async (req, res) => {
  try {
    const { id } = req.usuario; // viene del token decodificado

    const usuario = await usuarioModel.findById(id);
    if (!usuario) {
      return res.status(401).json({ error: "Se ha eliminado este usuario" });
    }
    const usuarioConURL = {
      ...usuario.toObject(),
      imgPerf: `${uploads_URL}${usuario.imgPerf}`, // URL completa
    };
    res.status(200).json({ data: usuarioConURL });
  } catch (error) {
    console.error("Error al intentar obtener el perfil del usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const loginUsuario = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    // 1. Buscar usuario
    const usuario = await usuarioModel.findOne({ email: email });

    if (!usuario) {
      return res.status(400).json({ message: "Usuario no registrado" });
    }

    // 2. Verificar contraseña
    const isMatch = await bcrypt.compare(password, usuario.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // 3. Generar token JWT
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      config.JWT_SECRET,
      { expiresIn: "10h" }
    );

    // 4. Responder con éxito
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      usuario,
      token,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const registroUsuario = async (req, res) => {
  // Imagen por defecto
  const imgPerf = "usuario.png";
  var { nombre, descripcion, apellido, nickName, email, telefono, password } = req.body;
  console.log(telefono);
  if (telefono == "") {
    telefono = 0;
  }
  try {
    // Verificar si el email ya está registrado
    const usuarioRepetido = await usuarioModel.findOne({ email });
    if (usuarioRepetido) {
      return res.status(403).json({ error: "Este email ya se encuentra registrado" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Crear usuario (guardando solo el nombre de la imagen)
    const usuario = new usuarioModel({
      imgPerf,
      nombre,
      descripcion,
      apellido,
      nickName,
      email,
      telefono,
      password: hashedPassword,
    });

    await usuario.save();

    // Crear una copia del usuario con la URL completa para enviar al frontend
    const usuarioConURL = {
      ...usuario.toObject(),
      imgPerf: `${uploads_URL}${usuario.imgPerf}`, // URL completa
    };

    res.status(200).json({ message: "Registro exitoso", usuario: usuarioConURL });

  } catch (error) {
    console.error("Error al registrarse:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const actualizarUsuario = async (req, res) => {
  const { nombre, id, nickName, apellido, telefono, descripcion} = req.body;
  console.log(req.body);
  try {
    const usuarioActualizado = await usuarioModel.updateOne(
      { _id: id },
      {
        $set: {
          nombre: nombre,
          apellido: apellido,
          nickName: nickName,
          telefono: telefono,
          descripcion: descripcion,
        },
      }
    );
    console.log(usuarioActualizado);
    if (!usuarioActualizado)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el usuario", error });
  }
};

export const actualizarImagenDeUsuario = async (req, res) => {

  try {
    const userId = req.headers.id; // ID del usuario autenticado
    console.log(userId);

    // Nombre del archivo (solo lo que se guardará en la BD)
    const fileName = req.file.filename;

    // URL completa que se enviará al frontend
    const imageUrl = `${uploads_URL}${fileName}`;

    // Guardamos solo el nombre del archivo en la base de datos
    const usuarioActualizado = await usuarioModel.updateOne(
      { _id: userId },
      { $set: { imgPerf: fileName } }
    );

    console.log(usuarioActualizado);

    // Devolvemos la URL completa al frontend
    res.json({
      message: "Imagen actualizada con éxito",
      imgPerf: imageUrl,
    });
    console.log(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la imagen", error });
  }
};

export const eliminarUsuario = async (req, res) => {
  const idUsuario = req.params.id;
  try {
    const usuarioEliminado = await usuarioModel.deleteOne({ _id: idUsuario });
    if (!usuarioEliminado)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar usuario" });
  }
};

export default {
  getUsuarios,
  getPerfil,
  registroUsuario,
  loginUsuario,
  actualizarUsuario,
  eliminarUsuario,
  actualizarImagenDeUsuario,
};
