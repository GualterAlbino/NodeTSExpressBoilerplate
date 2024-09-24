import BaseDTO from '../../base/BaseDTO'

export default class TraduzirExpressaoCronDTO extends BaseDTO {
  @BaseDTO.Required
  frequencia: string

  constructor(pObjeto: any, pValidarCadastro: boolean = true) {
    super()

    this.frequencia = pObjeto.frequencia

    if (pValidarCadastro) {
      BaseDTO.validate(this)
    }
  }
}
