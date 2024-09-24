import BaseDTO from '../../base/BaseDTO'
import AgendamentoModel from '../../../domain/agendamento/AgendamentoModel'

export default class AtualizarAgendamentoDTO extends BaseDTO {
  @BaseDTO.Optional
  frequencia: string

  @BaseDTO.Optional
  tipoAgendamento: string

  @BaseDTO.Required
  usuarioAlteracaoId: string

  constructor(pModel: AgendamentoModel, pValidarCadastro: boolean = true) {
    super(pModel)

    this.frequencia = pModel.frequencia
    this.tipoAgendamento = pModel.tipoAgendamento
    this.usuarioAlteracaoId = pModel.usuarioAlteracaoId

    if (pValidarCadastro) {
      BaseDTO.validate(this)
    }
  }

  toDomain() {
    try {
      return new AgendamentoModel(
        {
          frequencia: this.frequencia,
          tipoAgendamento: this.tipoAgendamento,
          usuarioAlteracaoId: this.usuarioAlteracaoId
        },
        true
      ).toObject()
    } catch (error) {
      throw error
    }
  }
}
