import BaseRepository from '../base/BaseRepository'

export default interface CronSchedulerRepository extends BaseRepository {
  listarTarefasAgendadas<Retorno>(): Retorno[]
  traduzirExpressaoCron(pExpressao: string): string
  cancelarTarefaAgendada<Retorno>(pTarefaId: string): Retorno | null
  preverProximaExecucao(pFrequenciaCron: string): string
  //iniciarAgendamentoDeTarefas<T>(pTarefas: T[]): Promise<T>;

  agendarTarefa<Model>(
    pFrequenciaCron: string,
    pModel: Model,
    pCallbackIniciar: () => Promise<void>,
    pCallbackProcessar: () => Promise<void>,
    pCallbackFinalizar: () => Promise<void>,
    pCallbackErro: (pMensagemErro: string) => Promise<void>
  ): Model | null
}
