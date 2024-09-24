import BaseDTO from '../../base/BaseDTO';
import TaskModel from '../../../domain/task/TaskModel';

export default class ListarTaskDTO extends BaseDTO {
  @BaseDTO.Required
  status: string;

  @BaseDTO.Required
  percentual: number;

  @BaseDTO.Optional
  mensagem: string;

  constructor(pTask: TaskModel, pValidarCadastro: boolean = true) {
    super(pTask);

    this.status = pTask.status;
    this.mensagem = pTask.mensagem;
    this.percentual = pTask.percentual;

    if (pValidarCadastro) {
      BaseDTO.validate(this);
    }
  }

  toDomain() {
    return new TaskModel(
      {
        status: this.status,
        percentual: this.percentual,
        mensagem: this.mensagem,
      },
      false,
    ).toObject();
  }
}
