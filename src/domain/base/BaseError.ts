export class BaseError extends Error {
  public readonly tipo: string //Tipo de erro (DataBaseError, NotFoundError, etc)
  public readonly erro: string //Erro original
  public readonly mensagem: string //Mensagem personalizada

  constructor(pTipo: string, pErro: string | any, pMensagem: string) {
    super(pMensagem)
    /**
     * Define o protótipo do objeto. O protótipo é o objeto que contém os métodos e propriedades que um objeto herda.
     * - https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
     * - https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype
     *
     *  Garante que o erro tenha a cadeia de protótipos correta, permitindo que ele se comporte como uma
     *  instância da classe de erro personalizada.
     */
    Object.setPrototypeOf(this, new.target.prototype)

    this.tipo = pTipo
    this.mensagem = pMensagem

    //Extrai a mensagem do erro caso exista
    if (pErro && pErro.message) this.erro = pErro.message
    else this.erro = pErro || ''

    /**
     * Captura a stack trace apenas se Error.captureStackTrace estiver disponível
     *  - https://nodejs.org/api/errors.html#errors_error_capturestacktrace_targetobject_constructoropt
     *
     * Captura a pilha de rastreamento da instância atual (this) e faz com que a pilha de rastreamento não
     * inclua o construtor da classe (this.constructor). Isso ajuda a garantir que o rastreamento da pilha
     * seja mais limpo e relevante para o local onde o erro foi lançado, e não para onde o erro foi criado.
     *
     * Garante que a pilha de rastreamento do erro seja precisa e útil para depuração.
     */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export class ValidationDTOError extends BaseError {
  constructor(pErro: any, pMensagem: string) {
    super('ValidarionDTOError', pErro, pMensagem)
  }
}

export class ValidationDomainError extends BaseError {
  constructor(pErro: any, pMensagem: string) {
    super('ValidationDomainError', pErro, pMensagem)
  }
}

export class NotFoundError extends BaseError {
  constructor(pErro: any, pMensagem: string) {
    super('NotFoundError', pErro, pMensagem)
  }
}

export class DatabaseError extends BaseError {
  constructor(pErro: any, pMensagem: string) {
    super('DatabaseError', pErro, pMensagem)
  }
}

export class InternalServiceError extends BaseError {
  constructor(pErro: any, pMensagem: string) {
    super('InternalServiceError', pErro, pMensagem) //502
  }
}

export class ExternalServiceError extends BaseError {
  constructor(pErro: any, pMensagem: string) {
    super('ExternalServiceError', pErro, pMensagem) //502
  }
}

export class UnauthorizedError extends BaseError {
  constructor(pErro: any, pMensagem: string) {
    super('UnauthorizedError', pErro, pMensagem) //401
  }
}
