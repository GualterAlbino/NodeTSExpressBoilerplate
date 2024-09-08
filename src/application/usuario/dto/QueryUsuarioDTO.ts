import UsuarioModel from '../../../domain/usuario/UsuarioModel'
import BaseDTO from '../../base/BaseDTO'

export class QueryUsuarioDTO extends BaseDTO {
  @BaseDTO.Optional
  nome?: string | undefined

  @BaseDTO.Optional
  role?: string | undefined

  @BaseDTO.Optional
  email?: string | undefined

  constructor(pUsuario: Partial<UsuarioModel>) {
    super()
    this.nome = pUsuario.nome
    this.role = pUsuario.role
    this.email = pUsuario.email
  }
}
