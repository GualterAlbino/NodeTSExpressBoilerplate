import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import UsuarioRoutes from "./routes/UsuarioRoutes";

export default class ExpressConfig {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    // ...
  }

  private routes(): void {
    this.app.use("/usuarios", UsuarioRoutes);

    // ...
  }
}
