import mongoose from "mongoose";

const reseñaSchema = new mongoose.Schema({
    idUsuario:{ type: mongoose.Schema.Types.ObjectId},
    idObra:{ type: mongoose.Schema.Types.ObjectId},
    contenido: {type: String, required: true},
    valoracion:{type: Number, required: true},
    fecha:{type: Date, required: true},
    likes:{type: Number, required: true}
});

export const reseñaModel = mongoose.model('reseñas', reseñaSchema);

export default reseñaModel;