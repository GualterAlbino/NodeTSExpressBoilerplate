import cors from "cors";
import express from "express";
import bodyParser from "body-parser";

//Routes...
import UsuarioRoutes from "./routes/UsuarioRoutes";

const PORT = process.env.EXPRESS_PORT || 3005;

export default class ExpressConfig {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();

    // ...

    this.app.listen(PORT, () => {
      console.log(
        `[EXPRESS] : SUCESSO => Aplicação em execução na porta: ${PORT}`,
      );
    });
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    // ...
  }

  private routes(): void {
    const basePath = "/v1";

    this.app.get("/", (req, res) => {
      res.send("API em execução...");
    });

    this.app.use(`${basePath}/usuarios`, UsuarioRoutes);

    // ...
  }
}
