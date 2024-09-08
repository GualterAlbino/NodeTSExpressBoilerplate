import UsuarioModel from '../../../domain/usuario/UsuarioModel'
import BaseDTO from '../../base/BaseDTO'

export class CriarUsuarioDTO extends BaseDTO {
  @BaseDTO.Required
  nome: string

  @BaseDTO.Required
  role: string

  @BaseDTO.Required
  email: string

  @BaseDTO.Required
  senha: string

  constructor(pNome: string, pRole: string, pEmail: string, pSenha: string) {
    super()
    this.nome = pNome
    this.role = pRole
    this.email = pEmail
    this.senha = pSenha

    BaseDTO.validate(this)
  }

  toDomain() {
    return new UsuarioModel(
      true,
      '',
      this.role,
      this.nome,
      this.email,
      this.senha
    ).toObject()
  }
}
