import mongoose, { Schema } from 'mongoose'
import UsuarioModel from '../../../domain/usuario/UsuarioModel'

const UsuarioSchema: Schema = new Schema({
  nome: { type: String, required: true, index: true },
  role: { type: String, required: true, index: true },
  email: { type: String, required: true, index: true },
  senha: { type: String, required: true },

  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<UsuarioModel>('Usuario', UsuarioSchema)
