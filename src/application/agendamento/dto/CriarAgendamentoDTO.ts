import BaseDTO from '../../base/BaseDTO'
import AgendamentoModel from '../../../domain/agendamento/AgendamentoModel'

export default class CriarAgendamentoDTO extends BaseDTO {
  @BaseDTO.Required
  usuarioCriacaoId: string

  @BaseDTO.Required
  frequencia: string

  @BaseDTO.Required
  tipoAgendamento: string

  constructor(pModel: AgendamentoModel, pValidarCadastro: boolean = true) {
    super(pModel)

    this.frequencia = pModel.frequencia
    this.tipoAgendamento = pModel.tipoAgendamento
    this.usuarioCriacaoId = pModel.usuarioCriacaoId

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
          usuarioCriacaoId: this.usuarioCriacaoId,
          usuarioAlteracaoId: this.usuarioCriacaoId
        },
        true
      ).toObject()
    } catch (error) {
      throw error
    }
  }
}
