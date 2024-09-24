import BaseModel from '../base/BaseModel'

export type TAgendamentoModel = {
  criadoEm: Date
  status: string
  atualizadoEm: Date
  frequencia: string
  tipoAgendamento: string
  usuarioCriacaoId: string
  usuarioAlteracaoId: string
}

export default class AgendamentoModel
  extends BaseModel<AgendamentoModel>
  implements TAgendamentoModel
{
  @BaseModel.Required
  frequencia: string = ''

  @BaseModel.Required
  usuarioCriacaoId: string = ''

  @BaseModel.Required
  usuarioAlteracaoId: string = ''

  @BaseModel.Required
  private _status: string = ''

  @BaseModel.Required
  private _tipoAgendamento: string = ''

  public static readonly ETipoAgendamento = {
    TIPOA: 'TIPOA',
    TIPOB: 'TIPOB',
    TIPOC: 'TIPOC'
  }

  public static readonly EAgendamentoStatus = {
    ATIVO: 'ATIVO',
    INATIVO: 'INATIVO'
  }

  constructor(
    pObjeto: Partial<TAgendamentoModel>,
    pValidarCadastro: boolean = true
  ) {
    super(pObjeto, pValidarCadastro)

    this.status = pObjeto.status || this.status
    this.frequencia = pObjeto.frequencia || this.frequencia
    this.tipoAgendamento = pObjeto.tipoAgendamento || this.tipoAgendamento
    this.usuarioCriacaoId = pObjeto.usuarioCriacaoId || this.usuarioCriacaoId
    this.usuarioAlteracaoId =
      pObjeto.usuarioAlteracaoId || this.usuarioAlteracaoId

    if (this.validarCadastro) {
      BaseModel.validate(this)
    }
  }

  //-------
  // Tipo de Agendamento
  //-------
  get tipoAgendamento() {
    return this._tipoAgendamento
  }

  set tipoAgendamento(pTipoAgendamento: string) {
    if (!pTipoAgendamento || pTipoAgendamento.trim() === '') {
      throw `O tipo de agendamento não pode ser vazio! Os tipos válidos são: ${Object.keys(AgendamentoModel.ETipoAgendamento).join(', ')}`
    }

    if (
      !(pTipoAgendamento.toUpperCase() in AgendamentoModel.ETipoAgendamento)
    ) {
      throw `O tipo de agendamento:[${pTipoAgendamento}] não é permitido! Os tipos válidos são: ${Object.keys(AgendamentoModel.ETipoAgendamento).join(', ')}`
    }

    this._tipoAgendamento = pTipoAgendamento.toUpperCase()
  }

  //-------
  // Status
  //-------
  get status() {
    return this._status
  }

  set status(pStatus: string) {
    if (!pStatus || pStatus.trim() === '') {
      throw `O status não pode ser vazio! Os status válidos são: ${Object.keys(AgendamentoModel.EAgendamentoStatus).join(', ')}`
    }

    if (!(pStatus.toUpperCase() in AgendamentoModel.EAgendamentoStatus)) {
      throw `O status: [${pStatus}] não é permitido! Os status válidos são: ${Object.keys(AgendamentoModel.EAgendamentoStatus).join(', ')}`
    }

    this._status = pStatus.toUpperCase()
  }
}
