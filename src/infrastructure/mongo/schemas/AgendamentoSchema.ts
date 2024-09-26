import mongoose, { Schema } from 'mongoose'
import { TAgendamentoModel } from '../../../domain/agendamento/AgendamentoModel'
import {
  cTABELA_AGENDAMENTO,
  cTABELA_USUARIO
} from '../constants/ConstantesMongoDB'

const schemaDefinition: Required<Record<keyof TAgendamentoModel, any>> = {
  id: { type: String, required: true, index: true },
  status: { type: String, required: true, index: true },
  frequencia: { type: String, required: true, index: true },
  tipoAgendamento: { type: String, required: true, index: true },

  // Relacionamentos
  usuarioCriacaoId: {
    type: Schema.Types.ObjectId,
    ref: cTABELA_USUARIO,
    required: true,
    index: true
  },

  usuarioAlteracaoId: {
    type: Schema.Types.ObjectId,
    ref: cTABELA_USUARIO,
    required: true,
    index: true
  },

  // Padrão
  criadoEm: { type: Date, default: Date.now },
  alteradoEm: { type: Date, default: Date.now }
}

const AgendamentoSchema = new Schema(schemaDefinition)

export default mongoose.model<TAgendamentoModel>(
  cTABELA_AGENDAMENTO,
  AgendamentoSchema,
  cTABELA_AGENDAMENTO
)
