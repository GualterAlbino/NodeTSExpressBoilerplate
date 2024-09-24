// Bibliotecas
import dotenv from 'dotenv'
import mongoose from 'mongoose'
dotenv.config()

// Logger
import Logger from '../../shared/utils/Logger'

export default class MongoConfig {
  private readonly host: string
  private readonly database: string
  private readonly logger: Logger = new Logger(this.constructor.name)

  constructor() {
    this.database = process.env.MONGODB_DATABASE || 'database'
    this.host = process.env.MONGODB_HOST || 'mongodb://localhost:27017'
  }

  async start() {
    try {
      this.logger.info(`Iniciando conexão com o banco...`)
      await mongoose.connect(`${this.host}/${this.database}`, {})
      const colecoes = []
      const conexao = mongoose.connection.db

      if (conexao) {
        colecoes.push(...(await conexao.listCollections().toArray()))
      }

      colecoes.map((c) => {
        //new DataWarehouseSchema(c.name, {});
      })

      this.logger.info(`Conexão ao banco realizada devidamente!`)
    } catch (error) {
      this.logger.info(`[CONEXÃO COM O BANCO] : ERRO => ${error}`)
      throw error // Lança o erro para interromper a inicialização do servidor
    }
  }
}
