// Bibliotecas
import mongoose, { Schema } from 'mongoose'

// Domain
import { TUsuarioModel } from '../../../domain/usuario/UsuarioModel'

// Constantes
import { cTABELA_USUARIO } from '../constants/ConstantesMongoDB'

const schemaDefinition: Required<Record<keyof TUsuarioModel, any>> = {
  id: { type: String, required: false, index: true },
  senha: { type: String, required: true },
  nome: { type: String, required: true, index: true },
  role: { type: String, required: true, index: true },
  email: { type: String, required: true, index: true },

  criadoEm: { type: Date, default: Date.now },
  alteradoEm: { type: Date, default: Date.now }
}

const UsuarioSchema = new Schema(schemaDefinition)

export default mongoose.model<TUsuarioModel>(
  cTABELA_USUARIO,
  UsuarioSchema,
  cTABELA_USUARIO
)
