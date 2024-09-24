import { Router } from 'express'

import { authMiddleware } from '../middleware/AuthMiddleware'
import TaskService from '../../../application/task/TaskService'
import TaskHandler from '../../../adapters/http/task/TaskHandler'
import TaskController from '../../../adapters/http/task/TaskController'
import TaskMongoRepository from '../../../adapters/mongo/task/TaskMongoRepository'
import CronSchedulerNodeRepository from '../../cron-scheduler/CronSchedulerNodeRepository'
import CronScheduleService from '../../../application/cron-scheduler/CronScheduleService'

const TaskRoutes = Router()

const taskRepository = new TaskMongoRepository()
const cronSchedulerRepository = new CronSchedulerNodeRepository()

const cronSchedulerService = new CronScheduleService(cronSchedulerRepository)
const taskService = new TaskService(taskRepository, cronSchedulerService)

const taskHandler = new TaskHandler(taskService)
const taskController = new TaskController(taskHandler)

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Lista todas as tasks
 *     tags: [Task]
 */
TaskRoutes.get('/', authMiddleware, (req, res, next) =>
  taskController.buscar(req, res, next)
)

/**
 * @swagger
 * /task:
 *   post:
 *     summary: Cria uma task
 *     tags: [Task]
 */
TaskRoutes.post('/', authMiddleware, (req, res, next) =>
  taskController.incluir(req, res, next)
)

/**
 * @swagger
 * /task/{id}:
 *   delete:
 *     summary: Exclui uma task
 *     tags: [Task]
 */
TaskRoutes.delete('/:id', authMiddleware, (req, res, next) =>
  taskController.excluir(req, res, next)
)

/**
 * @swagger
 * /task/{id}:
 *   put:
 *     summary: Atualiza uma task
 *     tags: [Task]
 */
TaskRoutes.patch('/:id', authMiddleware, (req, res, next) =>
  taskController.atualizar(req, res, next)
)

export default TaskRoutes
