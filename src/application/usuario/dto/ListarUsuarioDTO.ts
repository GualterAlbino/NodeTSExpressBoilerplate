import UsuarioModel from '../../../domain/usuario/UsuarioModel'
import BaseDTO from '../../base/BaseDTO'

export class ListarUsuarioDTO extends BaseDTO {
  @BaseDTO.Required
  id: string

  @BaseDTO.Required
  role: string

  @BaseDTO.Required
  nome: string

  @BaseDTO.Required
  email: string

  constructor(pUsuario: UsuarioModel) {
    super()
    this.id = pUsuario.id
    this.role = pUsuario.role
    this.nome = pUsuario.nome
    this.email = pUsuario.email
  }

  toDomain() {
    return new UsuarioModel(true, this.id, this.role, this.nome, this.email, '')
  }
}
