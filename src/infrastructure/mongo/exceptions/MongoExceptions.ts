import { BaseError } from '../../../domain/base/BaseError'

export class SchemaMongoExceptions extends BaseError {
  constructor(pErro: any, pMensagem: string) {
    super('SchemaMongoError', pErro, pMensagem)
  }
}
