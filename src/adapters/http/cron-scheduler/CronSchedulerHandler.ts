// Application
import CronScheduleService from '../../../application/cron-scheduler/CronScheduleService'

// Shared
import Logger from '../../../shared/utils/Logger'
import TraduzirExpressaoCronDTO from '../../../application/cron-scheduler/dto/TraduzirExpressaoCronDTO'

export default class CronSchedulerHandler {
  private readonly logger: Logger
  private readonly cronSchedulerService: CronScheduleService

  constructor(pCronSchedulerService: CronScheduleService) {
    this.logger = new Logger(this.constructor.name)
    this.cronSchedulerService = pCronSchedulerService
  }

  async listarTarefasAgendadas(): Promise<any> {
    try {
      return this.cronSchedulerService.listarTarefasAgendadas()
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async traduzirExpressaoCron(
    pFrequencia: TraduzirExpressaoCronDTO
  ): Promise<string> {
    try {
      return this.cronSchedulerService.traduzirExpressaoCron(pFrequencia)
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async preverProximaExecucao(
    pFrequencia: TraduzirExpressaoCronDTO
  ): Promise<string> {
    try {
      return this.cronSchedulerService.preverProximaExecucao(pFrequencia)
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }
}
