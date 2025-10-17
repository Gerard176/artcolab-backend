import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    imgPerf:{type: String, required: true},
    nombre:{type: String, required: true},
    descripcion:{type: String, required: false},
    apellido:{type: String, required: false},
    nickName:{type: String, required: false},
    email:{type: String, required: true},
    password:{type: String, required: true, minlenght: 7},
    telefono:{type: Number, required: false},
});

export const usuarioModel = mongoose.model('user', usuarioSchema);

export default usuarioModel;