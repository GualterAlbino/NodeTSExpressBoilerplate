// Bibliotecas
import { Repository } from 'typeorm'

// Domain
import TaskModel from '../../../domain/task/TaskModel'
import TaskRepository from '../../../domain/task/TaskRepository'

// Shared
import Logger from '../../../shared/utils/Logger'

// Infra
import PostgresConfig from '../../../infrastructure/postgres/PostgresConfig'
import TaskEntity from '../../../infrastructure/postgres/entities/TaskEntity'
import { validarUUID } from '../../../infrastructure/postgres/utils/ValidateStringUUID'
import UsuarioModel from '../../../domain/usuario/UsuarioModel'

export default class TaskPostgresRepository implements TaskRepository {
  private readonly logger: Logger
  private readonly taskRepository: Repository<TaskEntity>

  constructor() {
    this.logger = new Logger(this.constructor.name)

    // Usando a instância Singleton de PostgresConfig
    const postgresConfig = PostgresConfig.getInstance()
    this.taskRepository = postgresConfig
      .getDataSource()
      .getRepository(TaskEntity)
  }
  inicializarTarefasCron(): Promise<string> {
    throw new Error('Method not implemented.')
  }

  // Método para buscar usuários
  async buscar(pParams: Partial<TaskModel>): Promise<TaskModel[]> {
    try {
      const tasks = await this.taskRepository.find({ where: pParams })
      return tasks.map((task) => new TaskModel(task))
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async incluir(pRegistro: TaskModel): Promise<TaskModel> {
    try {
      validarUUID(pRegistro.agendamentoId, 'AgendamentoId')

      const usuario = await this.taskRepository.save(pRegistro)
      return new TaskModel(usuario)
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async excluir(pId: string): Promise<TaskModel | null> {
    try {
      validarUUID<UsuarioModel>(pId, 'id')

      const tasks = await this.taskRepository.findBy({ id: pId })
      if (!tasks || tasks.length === 0) {
        return null
      }

      const { raw, affected } = await this.taskRepository.delete(pId)

      if (affected === 0) {
        return null
      }

      return new TaskModel(tasks[0])
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async atualizar(
    pId: string,
    pRegistro: TaskModel
  ): Promise<TaskModel | null> {
    try {
      validarUUID<TaskModel>(pId, 'id')

      // Verifica se o usuário existe
      const usuarios = await this.taskRepository.findBy({ id: pId })
      if (!usuarios || usuarios.length === 0) {
        return null
      }

      // Atualiza o usuário
      const registro = pRegistro.toObject()

      const { raw, affected } = await this.taskRepository.update(pId, {
        status: registro.status,
        mensagem: registro.mensagem,
        percentual: registro.percentual,
        frequencia: registro.frequencia,
        alteradoEm: registro.alteradoEm
      })

      if (affected === 0) {
        return null
      }

      return new TaskModel(registro)
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }
}
