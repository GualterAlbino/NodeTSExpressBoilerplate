import BaseRepository from '../base/BaseRepository'
import AgendamentoModel from './AgendamentoModel'

export default interface AgendamentoRepository extends BaseRepository {
  excluir(pId: string): Promise<AgendamentoModel | null>
  incluir(pRegistro: AgendamentoModel): Promise<AgendamentoModel>
  atualizar(
    pId: string,
    pRegistro: Partial<AgendamentoModel>
  ): Promise<AgendamentoModel | null>
  buscar(pParams: Partial<AgendamentoModel>): Promise<AgendamentoModel[]>
}
