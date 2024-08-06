import { CriarUsuarioDTO } from "./dto/CriarUsuarioDTO";
import { ListarUsuarioDTO } from "./dto/ListarUsuarioDTO";
import UsuarioModel from "../../domain/usuario/UsuarioModel";
import { AtualizarUsuarioDTO } from "./dto/AtualizarUsuarioDTO";
import UsuarioRepository from "../../domain/usuario/UsuarioRepository";

export default class UsuarioService {
  private usuarioRepository: UsuarioRepository;

  constructor(pUsuarioRepository: UsuarioRepository) {
    this.usuarioRepository = pUsuarioRepository;
  }

  async buscar(): Promise<ListarUsuarioDTO[]> {
    console.log("UsuarioService");
    return this.usuarioRepository.buscar();
  }

  async incluir(pRegistro: CriarUsuarioDTO): Promise<UsuarioModel> {
    return this.usuarioRepository.incluir(pRegistro);
  }

  async excluir(pId: number): Promise<UsuarioModel> {
    return this.usuarioRepository.excluir(pId);
  }

  async atualizar(pRegistro: AtualizarUsuarioDTO): Promise<UsuarioModel> {
    return this.usuarioRepository.atualizar(pRegistro);
  }
}
