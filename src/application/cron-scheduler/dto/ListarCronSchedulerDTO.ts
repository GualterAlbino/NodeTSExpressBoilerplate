import BaseDTO from '../../base/BaseDTO'
import TaskModel from '../../../domain/task/TaskModel'

export default class ListarCronSchedulerDTO extends BaseDTO {
  @BaseDTO.Required
  status: string

  @BaseDTO.Required
  frequencia: string

  @BaseDTO.Required
  tipoAgendamento: string

  @BaseDTO.Optional
  percentual: number

  @BaseDTO.Required
  agendamentoId: string

  constructor(pTask: TaskModel, pValidarCadastro: boolean = true) {
    super(pTask)

    this.status = pTask.status
    this.frequencia = pTask.frequencia
    this.percentual = pTask.percentual
    this.agendamentoId = pTask.agendamentoId
    this.tipoAgendamento = pTask.tipoAgendamento

    if (pValidarCadastro) {
      BaseDTO.validate(this)
    }
  }

  toDomain() {
    return new TaskModel(
      {
        status: this.status,
        frequencia: this.frequencia,
        percentual: this.percentual,
        agendamentoId: this.agendamentoId,
        tipoAgendamento: this.tipoAgendamento
      },
      true
    ).toObject()
  }
}
