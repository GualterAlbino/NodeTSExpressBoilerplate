import BaseDTO from '../../base/BaseDTO'
import AgendamentoModel from '../../../domain/agendamento/AgendamentoModel'

export default class QueryAgendamentoDTO extends BaseDTO {
  @BaseDTO.Optional
  criadoEm: Date | undefined

  @BaseDTO.Optional
  atualizadoEm: Date | undefined

  @BaseDTO.Optional
  frequencia: string | undefined

  @BaseDTO.Optional
  usuarioCriacaoId: string | undefined

  @BaseDTO.Optional
  usuarioAlteracaoId: string | undefined

  constructor(pAgendamento: Partial<AgendamentoModel>) {
    super(pAgendamento)

    this.criadoEm = pAgendamento.criadoEm
    this.frequencia = pAgendamento.frequencia
    this.atualizadoEm = pAgendamento.atualizadoEm
    this.usuarioCriacaoId = pAgendamento.usuarioCriacaoId
    this.usuarioAlteracaoId = pAgendamento.usuarioAlteracaoId

    BaseDTO.validate(this)
  }
}
