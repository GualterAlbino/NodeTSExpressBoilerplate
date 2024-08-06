export default interface DomainRepository<T> {
  buscar(): Promise<T[]>;
  excluir(pId: number): Promise<T>;
  incluir(pRegistro: Partial<T>): Promise<T>;
  atualizar(pRegistro: Partial<T>): Promise<T>;
}
