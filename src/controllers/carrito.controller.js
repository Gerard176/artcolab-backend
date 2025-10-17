import carritoModel from "../models/carrito.model.js";
import publicacionModel from "../models/publicaciones.model.js";
import mongoose from "mongoose";

// Obtener todas las publicacions en el carrito de un usuario
export const getCarrito = async (req, res) => {
  try {
    const idUsuario = req.params.idUsuario;

    const data = await carritoModel.aggregate([
      { $match: { idUsuario: new mongoose.Types.ObjectId(idUsuario) } },
      {
        $project: {
          _id: 1,
          nombre: 1,
          precio: 1,
          cantidad: 1,
          img: 1,
          autor: 1,
          subtotal: { $multiply: ["$precio", "$cantidad"] }
        }
      },
      {
        $group: {
          _id: "$idUsuario",
          totalGastado: { $sum: "$subtotal" },
          items: {
            $push: {
              _id: "$_id",
              nombre: "$nombre",
              precio: "$precio",
              cantidad: "$cantidad",
              subtotal: "$subtotal",
              img: "$img",
              autor: "$autor"
            }
          }
        }
      }
    ]);

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el carrito del usuario", error });
  }
};

// Agregar una publicacion al carrito
export const addItemCarrito = async (req, res) => {
  try {
    const { idUsuario, idItem } = req.body;

    if (!idUsuario || !idItem) {
      return res.status(400).json({ message: "Faltan datos requeridos: idUsuario o idItem" });
    }

    const item = await publicacionModel.findById(idItem);
    if (!item) return res.status(404).json({ message: "La publicacion no existe" });

    // Buscar si la publicacion ya está en el carrito del usuario
    const itemExistente = await carritoModel.findOne({ idUsuario, idObra: item._id });

    if (itemExistente) {
      // Si ya existe, incrementamos la cantidad en 1
      itemExistente.cantidad += 1;
      await itemExistente.save();

      return res.status(200).json({
        message: "Cantidad actualizada en el carrito",
        data: itemExistente
      });
    }

    // Si no existe, lo agregamos por primera vez
    const nuevoItem = new carritoModel({
      idUsuario,
      idObra: item._id,
      categoria: item.categoria,
      tamaño: item.tamaño,
      nombre: item.nombre,
      autor: item.autor,
      img: item.img,
      precio: item.precio,
      descripcion: item.descripcion,
      cantidad: 1
    });

    await nuevoItem.save();

    res.status(200).json({
      message: "Obra agregada al carrito",
      data: nuevoItem
    });

  } catch (error) {
    console.error("Error en addItemCarrito:", error);
    res.status(500).json({ message: "Error al agregar la publicacion al carrito", error });
  }
};
export const updateCantidad = async (req, res) => {
  try {
    const idItem = req.params.idItem;
    const { cantidad } = req.body;

    if (!cantidad || cantidad < 1) {
      return res.status(400).json({ message: 'Cantidad inválida' });
    }

    const item = await carritoModel.findById(idItem);
    if (!item) return res.status(404).json({ message: 'Item no encontrado' });

    item.cantidad = cantidad;
    await item.save();

    res.status(200).json({
      message: 'Cantidad actualizada correctamente',
      item: {
        _id: item._id,
        cantidad: item.cantidad,
        subtotal: item.precio * item.cantidad,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar cantidad', error });
  }
};




// Eliminar una publicacion del carrito
export const deleteItemCarrito = async (req, res) => {
  try {
    const id = req.params.id;

    const item = await carritoModel.findById(id);

    if (!item) {
      return res.status(404).json({ message: "No se encontró el item a eliminar en el carrito" });
    }

    await carritoModel.deleteOne({ _id: id });

    res.status(200).json({
      message: "Obra eliminada del carrito",
      data: item
    });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la publicacion del carrito", error });
  }
};

export default {
  getCarrito,
  addItemCarrito,
  deleteItemCarrito,
  updateCantidad
};
