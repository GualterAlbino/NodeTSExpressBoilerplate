// Application
import TaskService from '../../application/task/TaskService'
import CronScheduleService from '../../application/cron-scheduler/CronScheduleService'

// Adapters
import TaskMongoRepository from '../../adapters/mongo/task/TaskMongoRepository'

// Repositories
import CronSchedulerNodeRepository from '../cron-scheduler/CronSchedulerNodeRepository'

// Shared
import Logger from '../../shared/utils/Logger'

export default class CronScheduleConfig {
  private readonly logger: Logger
  private readonly taskRepository: TaskMongoRepository
  private readonly cronSchedulerRepository: CronSchedulerNodeRepository

  constructor() {
    this.logger = new Logger(this.constructor.name)
    this.taskRepository = new TaskMongoRepository()
    this.cronSchedulerRepository = new CronSchedulerNodeRepository()
  }

  async start() {
    try {
      this.logger.info('Iniciando configuração de tarefas agendadas...')

      const cronSchedulerService = new CronScheduleService(
        this.cronSchedulerRepository
      )
      const taskService = new TaskService(
        this.taskRepository,
        cronSchedulerService
      )

      taskService.inicializarTarefasCron()
    } catch (error) {
      this.logger.error(
        `Falha ao iniciar configuração de tarefas agendadas: ${error}`
      )
    }
  }
}
