//Express
import { NextFunction, Request, Response } from 'express'

//Shared
import Logger from '../../../shared/utils/Logger'

// Adapters
import CronSchedulerHandler from './CronSchedulerHandler'
import TraduzirExpressaoCronDTO from '../../../application/cron-scheduler/dto/TraduzirExpressaoCronDTO'

export default class CronSchedulerController {
  private readonly logger: Logger
  private readonly cronSchedulerHandler: CronSchedulerHandler

  constructor(pCronSchedulerHandler: CronSchedulerHandler) {
    this.logger = new Logger(this.constructor.name)
    this.cronSchedulerHandler = pCronSchedulerHandler
  }

  async listarTarefasAgendadas(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const retorno = await this.cronSchedulerHandler.listarTarefasAgendadas()
      res.status(200).send(retorno)
    } catch (error) {
      this.logger.error(error)
      next(error)
    }
  }

  async traduzirExpressaoCron(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body
      const dto = new TraduzirExpressaoCronDTO(body)

      const retorno = await this.cronSchedulerHandler.traduzirExpressaoCron(dto)
      res.status(200).send(retorno)
    } catch (error) {
      this.logger.error(error)
      next(error)
    }
  }

  async preverProximaExecucao(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body
      const dto = new TraduzirExpressaoCronDTO(body)

      const retorno = await this.cronSchedulerHandler.preverProximaExecucao(dto)
      res.status(200).send(retorno)
    } catch (error) {
      this.logger.error(error)
      next(error)
    }
  }
}
