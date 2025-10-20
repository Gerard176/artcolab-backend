import mongoose from "mongoose";

const publicacionSchema = new mongoose.Schema({
  idUsuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // 👈 nombre del modelo del usuario
    required: true,
  },
  nombre: { type: String },
  likes: { type: Number },
  categoria: { type: String },
  img: { type: String,  default: null },
  descripcion: { type: String, required: true },
}, { timestamps: true });

export const publicacionModel = mongoose.model("Publication", publicacionSchema);
export default publicacionModel;