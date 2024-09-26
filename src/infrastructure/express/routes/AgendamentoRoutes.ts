import { Router } from 'express'

// Middleware
import { authMiddleware } from '../middleware/AuthMiddleware'

// Implementação dos Repository's
import TaskMongoRepository from '../../../adapters/mongo/task/TaskMongoRepository'
import TaskPostgresRepository from '../../../adapters/postgres/task/TaskPostgresRepository'
import CronSchedulerNodeRepository from '../../cron-scheduler/CronSchedulerNodeRepository'
import UsuarioMongoRepository from '../../../adapters/mongo/usuario/UsuarioMongoRepository'
import UsuarioPostgresRepository from '../../../adapters/postgres/usuario/UsuarioPostgresRepository'
import AgendamentoMongoRepository from '../../../adapters/mongo/agendamento/AgendamentoMongoRepository'
import AgendamentoPostgresRepository from '../../../adapters/postgres/agendamento/AgendamentoPostgresRepository'

import TaskService from '../../../application/task/TaskService'
import UsuarioService from '../../../application/usuario/UsuarioService'
import AgendamentoService from '../../../application/agendamento/AgendamentoService'

import AgendamentoHandler from '../../../adapters/http/agendamento/AgendamentoHandler'
import AgendamentoController from '../../../adapters/http/agendamento/AgendamentoController'
import CronScheduleService from '../../../application/cron-scheduler/CronScheduleService'

const AgendamentoRoutes = Router()

// Repositórios
//const taskRepository = new TaskMongoRepository()
const taskRepository = new TaskPostgresRepository()
//const usuarioRepository = new UsuarioMongoRepository()
const usuarioRepository = new UsuarioPostgresRepository()
const cronSchedulerRepository = new CronSchedulerNodeRepository()
//const agendamentoRepository = new AgendamentoMongoRepository()
const agendamentoRepository = new AgendamentoPostgresRepository()

// Serviços
const usuarioService = new UsuarioService(usuarioRepository)
const cronScheduleService = new CronScheduleService(cronSchedulerRepository)
const taskService = new TaskService(taskRepository, cronScheduleService)

const agendamentoService = new AgendamentoService(
  agendamentoRepository,
  usuarioService,
  taskService
)

const agendamentoHandler = new AgendamentoHandler(agendamentoService)
const agendamentoController = new AgendamentoController(agendamentoHandler)

/**
 * @swagger
 * /task:
 *   post:
 *     summary: Cria uma task
 *     tags: [Task]
 */
AgendamentoRoutes.post('/', authMiddleware, (req, res, next) =>
  agendamentoController.incluir(req, res, next)
)

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Lista as tasks agendadas
 *     tags: [Task]
 */
AgendamentoRoutes.get('/', authMiddleware, (req, res, next) =>
  agendamentoController.buscar(req, res, next)
)

/**
 * @swagger
 * /task/{id}:
 *   put:
 *     summary: Atualiza uma task
 *     tags: [Task]
 */
AgendamentoRoutes.patch('/:id', authMiddleware, (req, res, next) =>
  agendamentoController.atualizar(req, res, next)
)

/**
 * @swagger
 * /task/{id}:
 *   delete:
 *     summary: Exclui uma task
 *     tags: [Task]
 */
AgendamentoRoutes.delete('/:id', authMiddleware, (req, res, next) =>
  agendamentoController.excluir(req, res, next)
)

export default AgendamentoRoutes
