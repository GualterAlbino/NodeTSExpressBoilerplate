import { Router } from "express";
import UsuarioHandler from "../../../adapters/usuario/UsuarioHandler";
import UsuarioService from "../../../application/usuario/UsuarioService";
import UsuarioController from "../../../adapters/usuario/UsuarioController";
import UsuarioMongoRepository from "../../../adapters/usuario/UsuarioMongoRepository";

const UsuarioRoutes = Router();

const usuarioRepository = new UsuarioMongoRepository();
const usuarioService = new UsuarioService(usuarioRepository);
const usuarioHandler = new UsuarioHandler(usuarioService);
const usuarioController = new UsuarioController(usuarioHandler);

UsuarioRoutes.get("/", (req, res) => usuarioController.buscar(req, res));
UsuarioRoutes.post("/", (req, res) => usuarioController.incluir(req, res));

export default UsuarioRoutes;
