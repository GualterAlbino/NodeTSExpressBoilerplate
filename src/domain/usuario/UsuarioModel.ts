import BaseModel from '../base/BaseModel'
import { ValidationDomainError } from '../base/BaseError'

export default class UsuarioModel extends BaseModel<UsuarioModel> {
  id: string = ''

  @BaseModel.Required
  nome: string = ''

  @BaseModel.Required
  _email: string = ''

  @BaseModel.Required
  senha: string = ''

  @BaseModel.Required
  _role: string = ''

  public static readonly ERoleUsuario = {
    CLIENTE: 'CLIENTE',
    DESENVOLVEDOR: 'DESENVOLVEDOR',
    SUPER: 'SUPER'
  } as const

  constructor(
    pValidarCadastro: boolean = true,
    pId?: string,
    pRole?: string,
    pNome?: string,
    pEmail?: string,
    pSenha?: string
  ) {
    super()
    this.id = pId || this.id
    this.role = pRole || this.role
    this.nome = pNome || this.nome
    this.email = pEmail || this.email
    this.senha = pSenha || this.senha

    if (pValidarCadastro) {
      BaseModel.validate(this)
    }
  }

  //-------
  // Role
  //-------

  get role() {
    return this._role
  }

  set role(pRole: string) {
    if (!pRole || pRole.trim() === '') {
      throw new ValidationDomainError(
        '',
        `A role do usuário não pode ser vazia! As roles válidas são: ${Object.keys(UsuarioModel.ERoleUsuario).join(', ')}`
      )
    }

    if (!(pRole.toUpperCase() in UsuarioModel.ERoleUsuario)) {
      throw new ValidationDomainError(
        '',
        `O status:[${pRole}] não é permitido! Os status válidos são: ${Object.keys(UsuarioModel.ERoleUsuario).join(', ')}`
      )
    }

    this._role = pRole.toUpperCase()
  }

  //-------
  // Email
  //-------

  get email() {
    return this._email
  }

  set email(pEmail: string) {
    if (!pEmail || pEmail.trim() === '') {
      throw new ValidationDomainError(
        '',
        'O e-mail do usuário não pode ser vazio!'
      )
    }

    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!regex.test(pEmail)) {
      throw new ValidationDomainError('', `O e-mail: [${pEmail}] é inválido!`)
    }

    this._email = pEmail
  }
}
