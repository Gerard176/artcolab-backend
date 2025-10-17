import favoritoModel from "../models/favorito.model.js";
import publicacionModel from "../models/publicaciones.model.js";
import mongoose from "mongoose";


//Obtener todas las publicacions en el favorito
export const getFavorito = async (req, res) => {
  try {
    const idUsuario = req.params.idUsuario;

    const data = await favoritoModel.aggregate([
      { $match: { idUsuario: new mongoose.Types.ObjectId(idUsuario) } }, //transformamos el string de idUsuario en un objeto de id de mongo
    ]);

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el favorito del usuario", error });
  }
};

//agregar una publicacion al favorito
export const addItemFavorito = async (req, res) => {
    // try {
        const idUsuario = req.body.idUsuario;
        const idItem = req.body.idItem;
        console.log(idItem,idUsuario)
        const item = await publicacionModel.findOne({_id: idItem});

        const nuevoItem = new favoritoModel({
            idObra:idItem,
            idUsuario: idUsuario, 
            categoria: item.categoria,
            tamaño: item.tamaño,
            nombre: item.nombre,
            autor: item.autor,
            img: item.img,
            precio: item.precio,
            descripcion: item.descripcion,
        });
        await nuevoItem.save();// Guardar en la base de datos

        res.status(200).json({
            message: "Obra agregada al favorito",
            data: nuevoItem
        });

    // } catch (error) {
    //     res.status(500).json({ message: "Error al agregar la publicacion al favorito", error });
    // }
};

//eliminar una publicacion del favorito
export const deleteItemFavorito = async (req, res) => {
    try {
        const id = req.params.id;
        const item = await favoritoModel.findOne({_id: id });
        console.log(item)
        if (item.length == 0) return res.status(404).json({mensaje:"No se encontro el item a eliminar en el favorito"});

        await favoritoModel.deleteOne({ _id: id});
        res.status(200).json({
            message: "Obra eliminada del favorito",
            data: item
        });

    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la publicacion del favorito", error });
    }
};

export default {
    getFavorito,
    addItemFavorito,
    deleteItemFavorito
}