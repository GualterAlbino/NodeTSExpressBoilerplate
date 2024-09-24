import TaskService from '../../../application/task/TaskService';

// Application
import CriarTaskDTO from '../../../application/task/dto/CriarTaskDTO';
import QueryTaskDTO from '../../../application/task/dto/QueryTaskDTO';
import ListarTaskDTO from '../../../application/task/dto/ListarTaskDTO';
import AtualizarTaskDTO from '../../../application/task/dto/AtualizarTaskDTO';

// Shared
import Logger from '../../../shared/utils/Logger';
import SessaoAuthDTO from '../../../application/security/dto/SessaoAuthDTO';

export default class TaskHandler {
  private readonly logger: Logger;
  private readonly taskService: TaskService;

  constructor(pTaskService: TaskService) {
    this.taskService = pTaskService;
    this.logger = new Logger(this.constructor.name);
  }

  async incluir(pRegistro: CriarTaskDTO): Promise<ListarTaskDTO> {
    try {
      const registro = await this.taskService.incluir(pRegistro);
      return new ListarTaskDTO(registro);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async buscar(pParams: QueryTaskDTO): Promise<ListarTaskDTO[]> {
    try {
      // Passa os parâmetros de busca para o serviço
      const registros = await this.taskService.buscar(pParams);

      return registros.map((registro) => new ListarTaskDTO(registro));
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async excluir(pId: string): Promise<ListarTaskDTO> {
    try {
      const registro = await this.taskService.excluir(pId);

      return new ListarTaskDTO(registro);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async atualizar(
    pId: string,
    pRegistro: AtualizarTaskDTO,
  ): Promise<ListarTaskDTO> {
    try {
      const task = await this.taskService.atualizar(pId, pRegistro);

      return new ListarTaskDTO(task);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  /**
   *  Referente ao agendamento de tarefas
   */

  async listarTarefasAgendadas(
    pSessaoUsuario: SessaoAuthDTO,
  ): Promise<ListarTaskDTO[]> {
    try {
      const registros =
        await this.taskService.listarTarefasAgendadas(pSessaoUsuario);

      return registros.map((registro) => new ListarTaskDTO(registro));
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
