import { ValidationDTOError } from '../../domain/base/BaseError'

export default class BaseDTO {
  constructor() {}

  /**
   * Decorador para marcar uma propriedade como obrigatória.
   *
   * @param target - O objeto alvo do decorador.
   * @param propertyKey - O nome da propriedade.
   */
  static Required(target: any, propertyKey: string): void {
    if (!target) {
      return
    }

    // Inicializa a lista de campos obrigatórios se ainda não existir
    if (!target.constructor.requiredFields) {
      target.constructor.requiredFields = []
    }

    // Adiciona o nome da propriedade à lista de campos obrigatórios
    target.constructor.requiredFields.push(propertyKey)
  }

  static Optional(target: any, propertyKey: string): void {
    // Inicializa a lista de campos opcionais se ainda não existir
    if (!target.constructor.optionalFields) {
      target.constructor.optionalFields = []
    }

    // Adiciona o nome da propriedade à lista de campos opcionais
    target.constructor.optionalFields.push(propertyKey)
  }

  /**
   * Valida se todos os campos obrigatórios estão presentes e não vazios.
   *
   * @param obj - A instância a ser validada.
   * @throws {ValidationError} - Se algum campo obrigatório estiver vazio.
   */
  static validate(obj: any): void {
    // Obtém os campos obrigatórios da instância
    const requiredFields = obj.constructor.requiredFields || []

    // Filtra os campos obrigatórios que estão vazios
    const missingFields = requiredFields.filter((field: string) => !obj[field])

    // Se houver campos obrigatórios faltando, lança uma exceção de validação
    if (missingFields.length > 0) {
      throw new ValidationDTOError(
        '',
        `Os seguintes campos são obrigatórios e estão vazios: ${missingFields.join(', ')}`
      )
    }
  }
}
