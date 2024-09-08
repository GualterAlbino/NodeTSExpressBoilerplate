import UsuarioModel from './UsuarioModel'
import BaseRepository from '../base/BaseRepository'

export default interface UsuarioRepository
  extends BaseRepository {
  buscar(pParams: Partial<UsuarioModel>): Promise<UsuarioModel[]>
  incluir(pRegistro: UsuarioModel): Promise<UsuarioModel>
  excluir(pId: string): Promise<UsuarioModel | null>
  atualizar(pId: string, pRegistro: UsuarioModel): Promise<UsuarioModel | null>
}
