/**
 * Constroi um objeto de consulta com base nos parâmetros informados.
 * - O tipo genérico <T> é utilizado para garantir que o objeto de consulta retornado
 *   tenha as mesmas propriedades presentes nele.
 *
 * - Valores nulos ou indefinidos são ignorados e não são incluídos no objeto de consulta.
 *
 * Exemplo de uso: DTOs de consultas em repositórios.
 */
export function queryBuilder<T>(pParams: T): Partial<T> {
  try {
    return Object.keys(pParams as any).reduce((query, key) => {
      const value = (pParams as any)[key]

      if (value !== undefined && value !== null) {
        ;(query as any)[key] = value
      }

      return query
    }, {} as Partial<T>)
  } catch (error) {
    console.error(error)
    throw error
  }
}
