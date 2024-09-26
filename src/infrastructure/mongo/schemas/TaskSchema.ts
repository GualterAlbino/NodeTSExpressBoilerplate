// Bibliotecas
import mongoose, { Schema } from 'mongoose'

// Domain
import { TTaskModel } from '../../../domain/task/TaskModel'

// Constantes
import {
  cTABELA_TASK,
  cTABELA_AGENDAMENTO
} from '../constants/ConstantesMongoDB'

const schemaDefinition: Required<Record<keyof TTaskModel, any>> = {
  id: { type: String, required: true, index: true },
  percentual: { type: Number, default: 0 },
  mensagem: { type: String, required: false },
  status: { type: String, required: true, index: true },
  frequencia: { type: String, required: true, index: true },
  tipoAgendamento: { type: String, required: true, index: true },

  // Relacionamentos
  agendamentoId: {
    type: Schema.Types.ObjectId,
    ref: cTABELA_AGENDAMENTO,
    required: true,
    index: true
  },

  // Padrão
  criadoEm: { type: Date, default: Date.now },
  alteradoEm: { type: Date, default: Date.now }
}

const TaskSchema = new Schema(schemaDefinition)

export default mongoose.model<TTaskModel>(
  cTABELA_TASK,
  TaskSchema,
  cTABELA_TASK
)
