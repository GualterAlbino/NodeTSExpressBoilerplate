import TaskModel from './TaskModel'
import BaseRepository from '../base/BaseRepository'

export default interface TaskRepository extends BaseRepository {
  excluir(pId: string): Promise<TaskModel | null>
  incluir(pRegistro: TaskModel): Promise<TaskModel>
  buscar(pParams: Partial<TaskModel>): Promise<TaskModel[]>
  atualizar(pId: string, pRegistro: TaskModel): Promise<TaskModel | null>

  inicializarTarefasCron(): Promise<string>
}
