// src/adapters/repositories/UsuarioRepositoryImpl.ts
import UsuarioRepository from "../../domain/usuario/UsuarioRepository";
import UsuarioModel from "../../domain/usuario/UsuarioModel";
import UsuarioSchema, {
  IUsuario,
} from "../../infrastructure/mongo/schemas/UsuarioSchema";

export default class UsuarioMongoRepository implements UsuarioRepository {
  async buscar(): Promise<UsuarioModel[]> {
    console.log("UsuarioMongoRepository");
    return await UsuarioSchema.find().then((usuarios) =>
      usuarios.map((usuario) => this.toDomain(usuario)),
    );
  }
  excluir(pId: number): Promise<UsuarioModel> {
    throw new Error("Method not implemented.");
  }
  atualizar(pRegistro: Partial<UsuarioModel>): Promise<UsuarioModel> {
    throw new Error("Method not implemented.");
  }
  async incluir(usuario: Partial<UsuarioModel>): Promise<UsuarioModel> {
    const novoUsuario = new UsuarioSchema(usuario);
    const result = await novoUsuario.save();
    return this.toDomain(result);
  }

  private toDomain(usuario: IUsuario): UsuarioModel {
    return new UsuarioModel(
      usuario.id,
      usuario.nome,
      usuario.email,
      usuario.senha,
      usuario.nivel,
    );
  }
}
