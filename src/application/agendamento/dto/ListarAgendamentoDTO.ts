import BaseDTO from '../../base/BaseDTO'
import UsuarioModel from '../../../domain/usuario/UsuarioModel'
import AgendamentoModel from '../../../domain/agendamento/AgendamentoModel'
import ListarUsuarioDTO from '../../../application/usuario/dto/ListarUsuarioDTO'

export default class ListarAgendamentoDTO extends BaseDTO {
  @BaseDTO.Required
  frequencia: string

  @BaseDTO.Required
  tipoAgendamento: string

  @BaseDTO.Optional
  usuario?: ListarUsuarioDTO

  @BaseDTO.Required
  criadoEm: Date

  @BaseDTO.Required
  alteradoEm: Date

  constructor(
    pAgendamento: AgendamentoModel,
    pUsuario?: UsuarioModel,
    pValidarCadastro: boolean = true
  ) {
    super(pAgendamento)

    this.criadoEm = pAgendamento.criadoEm
    this.frequencia = pAgendamento.frequencia
    this.alteradoEm = pAgendamento.alteradoEm
    this.tipoAgendamento = pAgendamento.tipoAgendamento

    if (pUsuario) {
      this.usuario = new ListarUsuarioDTO(pUsuario)
    } else {
      delete this.usuario
    }

    if (pValidarCadastro) {
      BaseDTO.validate(this)
    }
  }
}
