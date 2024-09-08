import UsuarioModel from '../../../domain/usuario/UsuarioModel'
import BaseDTO from '../../base/BaseDTO'

export class AtualizarUsuarioDTO extends BaseDTO {
  @BaseDTO.Optional
  nome: string

  @BaseDTO.Optional
  role: string

  @BaseDTO.Optional
  email: string

  @BaseDTO.Optional
  senha: string

  constructor(pNome: string, pRole: string, pEmail: string, pSenha: string) {
    super()
    this.nome = pNome
    this.role = pRole
    this.email = pEmail
    this.senha = pSenha
  }

  toDomain() {
    return new UsuarioModel(
      false,
      '',
      this.role,
      this.nome,
      this.email,
      this.senha
    )
  }
}
