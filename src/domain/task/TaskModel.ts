import BaseModel from '../base/BaseModel'

export type TTaskModel = {
  criadoEm: Date
  status: string
  mensagem: string
  percentual: number
  frequencia: string
  atualizadoEm: Date
  agendamentoId: string
  tipoAgendamento: string
}

export default class TaskModel
  extends BaseModel<TaskModel>
  implements TTaskModel
{
  @BaseModel.Required
  frequencia: string = ''

  @BaseModel.Required
  tipoAgendamento: string = ''

  @BaseModel.Required
  public agendamentoId: string = ''

  @BaseModel.Optional
  public mensagem: string = ''

  @BaseModel.Required
  private _status: string = ''

  @BaseModel.Optional
  private _percentual: number = 0

  public static readonly EStatusTask = {
    ERRO: 'ERRO',
    AGENDADO: 'AGENDADO',
    EM_ESPERA: 'EM_ESPERA',
    PROCESSANDO: 'PROCESSANDO',
    FINALIZADO: 'FINALIZADO'
  } as const

  constructor(pObjeto: Partial<TaskModel>, pValidarCadastro: boolean = true) {
    super(pObjeto, pValidarCadastro)

    this.status = pObjeto.status || this._status
    this.mensagem = pObjeto.mensagem || this.mensagem
    this.frequencia = pObjeto.frequencia || this.frequencia
    this.percentual = pObjeto.percentual || this._percentual
    this.agendamentoId = pObjeto.agendamentoId || this.agendamentoId
    this.tipoAgendamento = pObjeto.tipoAgendamento || this.tipoAgendamento

    if (pValidarCadastro) {
      BaseModel.validate(this)
    }
  }

  //-------
  // Status
  //-------
  get status() {
    return this._status
  }

  set status(pStatus: string) {
    if (!pStatus || pStatus.trim() === '') {
      throw `O status não pode ser vazio! Os status válidos são: ${Object.keys(TaskModel.EStatusTask).join(', ')}`
    }

    if (!(pStatus.toUpperCase() in TaskModel.EStatusTask)) {
      throw `O status: [${pStatus}] não é permitido! Os status válidos são: ${Object.keys(TaskModel.EStatusTask).join(', ')}`
    }

    this._status = pStatus.toUpperCase()
  }

  //-------
  // Percentual
  //-------
  get percentual() {
    return this._percentual
  }

  set percentual(pPercentual: number) {
    if (pPercentual < 0 || pPercentual > 100) {
      throw 'Percentual inválido!'
    } else {
      this._percentual = pPercentual
    }
  }
}
