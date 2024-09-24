// Mongo
import MongoConfig from './mongo/MongoConfig'

// Express
import ExpressConfig from './express/ExpressConfig'

// Swagger
import SwaggerConfig from './swagger/SwaggerConfig'

// Cron Scheduler
import CronScheduleConfig from './cron-scheduler/CronSchedulerConfig'

// Logger
import Logger from '../shared/utils/Logger'
const logger = new Logger('Server')

async function IniciarServer() {
  try {
    logger.info('Iniciando o servidor...')

    // Conectando ao MongoDB
    const mongo = new MongoConfig()
    await mongo.start()

    // Configurando o Express
    const express = new ExpressConfig()
    await express.start()

    // Configurando o Swagger
    const swagger = new SwaggerConfig(express.app)
    await swagger.start()

    // Tarefas agendadas
    const cronScheduler = new CronScheduleConfig()
    await cronScheduler.start()

    logger.info('Servidor iniciado com sucesso!')
  } catch (error) {
    logger.error(`Falha ao iniciar o servidor: ${error}`)
  }
}

IniciarServer()

/*
// Tarefas agendadas
import TaskMongoRepository from '../adapters/mongo/task/TaskMongoRepository'
import CronScheduleService from '../application/cron-scheduler/CronScheduleService'
import CronSchedulerNodeRepository from './cron-scheduler/CronSchedulerNodeRepository'
import TaskService from '../application/task/TaskService'

// Repositórios
const taskRepository = new TaskMongoRepository()
const cronSchedulerRepository = new CronSchedulerNodeRepository()

// Serviços
const cronSchedulerService = new CronScheduleService(cronSchedulerRepository)
const taskService = new TaskService(taskRepository, cronSchedulerService)

taskService.inicializarTarefasCron()

//console.log(scheduler.listarTarefasAgendadas());
*/
