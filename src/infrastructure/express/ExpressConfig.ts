// Bibliotecas
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'

// Routes
import AuthRoutes from './routes/AuthRoutes'
import UsuarioRoutes from './routes/UsuarioRoutes'

// Middlewares
import errorHandler from './middleware/ErrorHandler'
import Logger from '../../shared/utils/Logger'
import TaskRoutes from './routes/TaskRoutes'
import CronSchedulerRoutes from './routes/CronSchedulerRoutes'
import AgendamentoRoutes from './routes/AgendamentoRoutes'

export default class ExpressConfig {
  private readonly porta: number
  private readonly logger: Logger
  public readonly app: express.Application

  constructor() {
    this.app = express()
    this.logger = new Logger(this.constructor.name)
    this.porta = Number(process.env.EXPRESS_PORT) || 3005
  }

  async start(): Promise<void> {
    try {
      this.logger.info('Iniciando configuração do Express...')

      this.config()
      this.routes()
      this.middlewares()

      // ...

      this.app.listen(this.porta, () => {})

      this.logger.info(`Aplicação em execução na porta: ${this.porta}!`)
    } catch (error) {
      this.logger.info(`[CONEXÃO COM O BANCO] : ERRO => ${error}`)
      throw error // Lança o erro para interromper a inicialização do servidor
    }
  }

  private config(): void {
    this.app.use(cors())
    this.app.use(bodyParser.json())

    // ...
  }

  private routes(): void {
    const basePath = '/v1'

    this.app.use(`${basePath}/auth`, AuthRoutes)
    this.app.use(`${basePath}/task`, TaskRoutes)
    this.app.use(`${basePath}/usuario`, UsuarioRoutes)
    this.app.use(`${basePath}/cron`, CronSchedulerRoutes)
    this.app.use(`${basePath}/agendamento`, AgendamentoRoutes)

    // ...

    this.app.get('/', (req, res) => {
      res.send('API em execução')
    })
  }

  private middlewares(): void {
    this.app.use(errorHandler)
  }
}
