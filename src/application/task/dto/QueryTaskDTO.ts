import BaseDTO from '../../base/BaseDTO'
import TaskModel from '../../../domain/task/TaskModel'

export default class QueryTaskDTO extends BaseDTO {
  @BaseDTO.Optional
  status: string | undefined

  @BaseDTO.Optional
  agendamentoId: string | undefined

  @BaseDTO.Optional
  percentual: number | undefined

  @BaseDTO.Optional
  mensagem: string | undefined

  constructor(pTask: Partial<TaskModel>, pValidarCadastro: boolean = true) {
    super(pTask)
    this.status = pTask.status
    this.agendamentoId = pTask.agendamentoId
    this.percentual = pTask.percentual
    this.mensagem = pTask.mensagem

    if (pValidarCadastro) {
      BaseDTO.validate(this)
    }
  }
}
