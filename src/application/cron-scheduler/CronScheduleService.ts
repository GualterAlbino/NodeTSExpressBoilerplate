// Domain
import CronSchedulerRepository from '../../domain/cron-scheduler/CronSchedulerRepository'

// Shared
import Logger from '../../shared/utils/Logger'

// Application
import TraduzirExpressaoCronDTO from './dto/TraduzirExpressaoCronDTO'
import { CronScheduleInternalServiceException } from './exceptions/CronScheduleException'

export default class CronScheduleService {
  private readonly logger: Logger
  private readonly cronSchedulerRepository: CronSchedulerRepository

  constructor(pCronScheduler: CronSchedulerRepository) {
    this.cronSchedulerRepository = pCronScheduler
    this.logger = new Logger(this.constructor.name)
  }

  agendarTarefa<Model>(
    pFrequenciaCron: string,
    pModel: Model,
    pCallbackIniciar: () => Promise<void>,
    pCallbackProcessar: () => Promise<void>,
    pCallbackFinalizar: () => Promise<void>,
    pCallbackErro: (pMensagemErro: string) => Promise<void>
  ): Model | null {
    try {
      // Agenda a tarefa usando o agendador
      const registros = this.cronSchedulerRepository.agendarTarefa<Model>(
        pFrequenciaCron,
        pModel,
        pCallbackIniciar,
        pCallbackProcessar,
        pCallbackFinalizar,
        pCallbackErro
      )

      return registros
    } catch (error) {
      this.logger.error(error)
      throw new CronScheduleInternalServiceException(
        error,
        'Erro ao agendar a tarefa.'
      )
    }
  }

  cancelarTarefaAgendada<Retorno>(pTarefaId: string): Retorno | null {
    try {
      return this.cronSchedulerRepository.cancelarTarefaAgendada<Retorno>(
        pTarefaId
      )
    } catch (error) {
      this.logger.error(error)
      throw new CronScheduleInternalServiceException(
        error,
        'Erro ao cancelar a tarefa agendada.'
      )
    }
  }

  listarTarefasAgendadas<T>(): T[] {
    try {
      return this.cronSchedulerRepository.listarTarefasAgendadas<T>()
    } catch (error) {
      this.logger.error(error)
      throw new CronScheduleInternalServiceException(
        error,
        'Erro ao listar as tarefas agendadas.'
      )
    }
  }

  async traduzirExpressaoCron(
    pFrequencia: TraduzirExpressaoCronDTO
  ): Promise<string> {
    try {
      return this.cronSchedulerRepository.traduzirExpressaoCron(
        pFrequencia.frequencia
      )
    } catch (error) {
      this.logger.error(error)
      throw new CronScheduleInternalServiceException(
        error,
        'Erro ao traduzir a frequência do cron.'
      )
    }
  }

  async preverProximaExecucao(
    pFrequencia: TraduzirExpressaoCronDTO
  ): Promise<string> {
    try {
      return this.cronSchedulerRepository.preverProximaExecucao(
        pFrequencia.frequencia
      )
    } catch (error) {
      this.logger.error(error)
      throw new CronScheduleInternalServiceException(
        error,
        'Erro ao prever a próxima execução da tarefa.'
      )
    }
  }
}
