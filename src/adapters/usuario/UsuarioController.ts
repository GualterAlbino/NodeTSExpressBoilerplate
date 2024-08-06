import { Request, Response } from "express";
import UsuarioHandler from "./UsuarioHandler";
import { CriarUsuarioDTO } from "../../application/usuario/dto/CriarUsuarioDTO";
import { ListarUsuarioDTO } from "../../application/usuario/dto/ListarUsuarioDTO";

export default class UsuarioController {
  private usuarioHandler: UsuarioHandler;

  constructor(usuarioHandler: UsuarioHandler) {
    this.usuarioHandler = usuarioHandler;
  }

  async incluir(req: Request, res: Response): Promise<void> {
    const dto = req.body as CriarUsuarioDTO;
    await this.usuarioHandler.incluir(dto);
    res.status(201).send();
  }

  async buscar(req: Request, res: Response): Promise<void> {
    console.log("UsuarioController");
    const dto = req.query as any as ListarUsuarioDTO;
    const usuarios = await this.usuarioHandler.buscar();
    res.status(200).json(usuarios);
  }

  async excluir(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    await this.usuarioHandler.excluir(id);
    res.status(204).send();
  }

  async atualizar(req: Request, res: Response): Promise<void> {
    const dto = req.body as CriarUsuarioDTO;
    await this.usuarioHandler.atualizar(dto);
    res.status(204).send();
  }
}
