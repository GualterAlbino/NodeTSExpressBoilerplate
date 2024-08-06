import UsuarioService from "../../application/usuario/UsuarioService";
import { CriarUsuarioDTO } from "../../application/usuario/dto/CriarUsuarioDTO";

export default class UsuarioHandler {
  private usuarioService: UsuarioService;

  constructor(pUsuarioService: UsuarioService) {
    this.usuarioService = pUsuarioService;
  }

  async incluir(pRegistro: CriarUsuarioDTO): Promise<void> {
    try {
      await this.usuarioService.incluir(pRegistro);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async buscar(): Promise<void> {
    try {
      console.log("UsuarioHandler");
      await this.usuarioService.buscar();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async excluir(pId: number): Promise<void> {
    try {
      await this.usuarioService.excluir(pId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async atualizar(pRegistro: CriarUsuarioDTO): Promise<void> {
    try {
      await this.usuarioService.atualizar(pRegistro);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
