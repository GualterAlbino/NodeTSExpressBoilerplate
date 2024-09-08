import { Router } from 'express'

import { Request, Response, NextFunction } from 'express'

import UsuarioHandler from '../../../adapters/http/usuario/UsuarioHandler'
import UsuarioService from '../../../application/usuario/UsuarioService'
import UsuarioController from '../../../adapters/http/usuario/UsuarioController'
import UsuarioMongoRepository from '../../../adapters/mongo/usuario/UsuarioMongoRepository'
import authGuard from '../middleware/AuthGuard'

const UsuarioRoutes = Router()

const usuarioRepository = new UsuarioMongoRepository()
const usuarioService = new UsuarioService(usuarioRepository)
const usuarioHandler = new UsuarioHandler(usuarioService)
const usuarioController = new UsuarioController(usuarioHandler)

/**
 * @swagger
 * /usuario:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuario]
 */
UsuarioRoutes.get(
  '/',
  authGuard,
  async (req: Request, res: Response, next: NextFunction) =>
    usuarioController.buscar(req, res, next)
)

/**
 * @swagger
 * /usuario:
 *   post:
 *     summary: Cria um usuário
 *     tags: [Usuario]
 */
UsuarioRoutes.post('/', (req, res, next) =>
  usuarioController.incluir(req, res, next)
)

/**
 * @swagger
 * /usuario/{id}:
 *   delete:
 *     summary: Exclui um usuario
 *     tags: [Usuario]
 */
UsuarioRoutes.delete('/:id', (req, res, next) =>
  usuarioController.excluir(req, res, next)
)

/**
 * @swagger
 * /usuario/{id}:
 *   patch:
 *     summary: Atualiza um usuario
 *     tags: [Usuario]
 */
UsuarioRoutes.patch('/:id', (req, res, next) =>
  usuarioController.atualizar(req, res, next)
)

export default UsuarioRoutes
