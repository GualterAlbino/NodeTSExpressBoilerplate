import BaseDTO from '../../base/BaseDTO'
import TaskModel from '../../../domain/task/TaskModel'

export default class AtualizarTaskDTO extends BaseDTO {
  @BaseDTO.Optional
  status: string

  @BaseDTO.Optional
  frequencia: string

  @BaseDTO.Optional
  tipoAgendamento: string

  @BaseDTO.Optional
  percentual: number

  constructor(pTask: TaskModel, pValidarCadastro: boolean = true) {
    super(pTask)

    this.status = pTask.status
    this.frequencia = pTask.frequencia
    this.percentual = pTask.percentual
    this.tipoAgendamento = pTask.tipoAgendamento

    if (pValidarCadastro) {
      BaseDTO.validate(this)
    }
  }

  toDomain() {
    return new TaskModel(
      {
        agendamentoId: '',
        status: this.status,
        frequencia: this.frequencia,
        percentual: this.percentual,
        tipoAgendamento: this.tipoAgendamento
      },
      true
    ).toObject()
  }
}
