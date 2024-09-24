import { Router } from 'express'

import AuthService from '../../../application/security/AuthService'
import AuthHandler from '../../../adapters/http/security/AuthHandler'
import AuthController from '../../../adapters/http/security/AuthController'
import UsuarioMongoRepository from '../../../adapters/mongo/usuario/UsuarioMongoRepository'

const AuthRoutes = Router()

const usuarioRepository = new UsuarioMongoRepository()
const authService = new AuthService(usuarioRepository)
const authHandler = new AuthHandler(authService)
const authController = new AuthController(authHandler)

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Realiza o login
 *     tags: [Auth]
 */
AuthRoutes.post('/login', (req, res, next) =>
  authController.login(req, res, next)
)

export default AuthRoutes
