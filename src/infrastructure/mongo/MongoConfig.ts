import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const database = process.env.MONGODB_DATABASE || 'database'
const host = process.env.MONGODB_HOST || 'mongodb://localhost:27017'

export default class MongoConfig {
  constructor() {
    mongoose
      .connect(`${host}/${database}`, {})
      .then(async () => {
        const colecoes = []
        const conexao = mongoose.connection.db
        if (conexao) {
          colecoes.push(...(await conexao.listCollections().toArray()))
        }

        colecoes.map((c) => {
          //new DataWarehouseSchema(c.name, {});
        })
        console.log(
          `[CONEXÃO COM O BANCO] : SUCESSO => Conexão ao banco realizada devidamente!`
        )
      })
      .catch((error) => {
        console.log(`[CONEXÃO COM O BANCO] : ERRO => ${error}`)
      })
  }
}
