import mongoose from "mongoose";

const publicacionSchema = new mongoose.Schema({
  idUsuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // 👈 nombre del modelo del usuario
    required: true,
  },
  nombre: { type: String },
  categoria: { type: String },
  img: { type: String },
  descripcion: { type: String, required: true },
}, { timestamps: true });

export const publicacionModel = mongoose.model("Publication", publicacionSchema);
export default publicacionModel;