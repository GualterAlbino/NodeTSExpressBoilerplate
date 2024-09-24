import { Router } from 'express'

import { authMiddleware } from '../middleware/AuthMiddleware'
import CronScheduleService from '../../../application/cron-scheduler/CronScheduleService'
import CronSchedulerNodeRepository from '../../cron-scheduler/CronSchedulerNodeRepository'
import CronSchedulerHandler from '../../../adapters/http/cron-scheduler/CronSchedulerHandler'
import CronSchedulerController from '../../../adapters/http/cron-scheduler/CronSchedulerController'

const CronSchedulerRoutes = Router()

const cronSchedulerRepository = new CronSchedulerNodeRepository()
const cronSchedulerService = new CronScheduleService(cronSchedulerRepository)
const cronSchedulerHandler = new CronSchedulerHandler(cronSchedulerService)
const cronSchedulerController = new CronSchedulerController(
  cronSchedulerHandler
)

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Lista todas as tarefas cron agendadas
 *     tags: [Task]
 */
CronSchedulerRoutes.get('/', authMiddleware, (req, res, next) =>
  cronSchedulerController.listarTarefasAgendadas(req, res, next)
)

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Traduz a expressão cron para uma descrição amigável
 *     tags: [Task]
 */
CronSchedulerRoutes.post('/traduzir', authMiddleware, (req, res, next) =>
  cronSchedulerController.traduzirExpressaoCron(req, res, next)
)

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Traduz a expressão cron para uma descrição amigável
 *     tags: [Task]
 */
CronSchedulerRoutes.post('/previsao', authMiddleware, (req, res, next) =>
  cronSchedulerController.preverProximaExecucao(req, res, next)
)

export default CronSchedulerRoutes
