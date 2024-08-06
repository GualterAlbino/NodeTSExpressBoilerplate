// src/infrastructure/database/schemas/UsuarioSchema.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUsuario extends Document {
  id: number;
  nome: string;
  email: string;
  senha: string;
  nivel: number;
}

const UsuarioSchema: Schema = new Schema({
  id: { type: Number, required: true },
  nome: { type: String, required: true },
  email: { type: String, required: true },
  senha: { type: String, required: true },
  nivel: { type: Number, required: true },
});

export default mongoose.model<IUsuario>("Usuario", UsuarioSchema);
