import mongoose from "mongoose";

const ItemFavoritoSchema = new mongoose.Schema({
    idUsuario: { type: mongoose.Schema.Types.ObjectId, required: true },
    idObra: { type: mongoose.Schema.Types.ObjectId, required: true },
    categoria:{ type: String, required: true},
    tamaño:{type: String, required: true},
    nombre:{type: String, required: true},
    autor:{type: String, required: true},
    img:{type: String, required: true},
    precio:{type: Number, required: true},
    descripcion:{type: String, required: true},
});

export const favoritoModel = mongoose.model('FavoritoItem', ItemFavoritoSchema);

export default favoritoModel;