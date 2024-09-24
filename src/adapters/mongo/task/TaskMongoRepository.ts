//Domain
import TaskModel from '../../../domain/task/TaskModel'
import TaskRepository from '../../../domain/task/TaskRepository'

//Aplication
import QueryTaskDTO from '../../../application/task/dto/QueryTaskDTO'

//Infra
import TaskSchema from '../../../infrastructure/mongo/schemas/TaskSchema'
import { queryBuilder } from '../../../infrastructure/mongo/utils/QueryBuilder'
import { stringToObjectIDMongo } from '../../../infrastructure/mongo/utils/StringToObjectIDMongo'

//Shared
import Logger from '../../../shared/utils/Logger'

export default class TaskMongoRepository implements TaskRepository {
  private readonly logger = new Logger(this.constructor.name)

  async buscar(pParams: QueryTaskDTO): Promise<TaskModel[]> {
    try {
      const query = queryBuilder(pParams)

      const tasks = await TaskSchema.find(query).exec()

      return tasks.map((task) => new TaskModel(task))
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async incluir(pRegistro: TaskModel): Promise<TaskModel> {
    try {
      const task = await new TaskSchema(pRegistro).save()
      return new TaskModel(task)
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
      // Converter o pId para ObjectId
      const objectId = stringToObjectIDMongo(pId)

      const updatedTask = await TaskSchema.findByIdAndUpdate(
        objectId,
        {
          status: pRegistro.status,
          mensagem: pRegistro.mensagem,
          percentual: pRegistro.percentual
        },
        { new: true }
      ).exec()

      return updatedTask ? new TaskModel(updatedTask) : null
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async excluir(pId: string): Promise<TaskModel | null> {
    try {
      const taskDeletada = await TaskSchema.findByIdAndDelete(pId).exec()

      return taskDeletada ? new TaskModel(taskDeletada) : null
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  inicializarTarefasCron(): Promise<string> {
    throw new Error('Method not implemented.')
  }
}
