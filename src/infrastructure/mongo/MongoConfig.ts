import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const database = process.env.MONGODB_DATABASE || "database";
const host = process.env.MONGODB_HOST || "mongodb://localhost:27017";

export default class MongoConfig {
  constructor(app: Express.Application) {
    mongoose
      .connect(`${host}/${database}`, {})
      .then(async () => {
        console.log(
          `[CONEXÃO COM O BANCO] : SUCESSO => Conexão ao banco realizada devidamente!`,
        );
        const colecoes = await mongoose.connection.db
          .listCollections()
          .toArray();
        colecoes.map((c) => {
          console.log(`[CONEXÃO COM O BANCO] : COLEÇÃO => ${c.name}`);
        });
      })
      .catch((error) => {
        console.log(`[CONEXÃO COM O BANCO] : ERRO => ${error}`);
      });
  }
}
