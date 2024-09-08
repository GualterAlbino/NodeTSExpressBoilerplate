//Domain
import UsuarioModel from '../../../domain/usuario/UsuarioModel'
import UsuarioRepository from '../../../domain/usuario/UsuarioRepository'
import { DatabaseError, NotFoundError } from '../../../domain/base/BaseError'

//Aplication
import { QueryUsuarioDTO } from '../../../application/usuario/dto/QueryUsuarioDTO'

//Infra
import UsuarioSchema from '../../../infrastructure/mongo/schemas/UsuarioSchema'

//Shared
import Logger from '../../../shared/utils/Logger'
import { queryBuilder } from '../../../shared/utils/QueryBuilder'
import { stringToObjectIDMongo } from '../../../shared/utils/StringToObjectIDMongo'

export default class UsuarioMongoRepository implements UsuarioRepository {
  private readonly logger = new Logger(this.constructor.name)

  async buscar(pParams: QueryUsuarioDTO): Promise<UsuarioModel[]> {
    try {
      const query = queryBuilder(pParams)
      const usuarios = await UsuarioSchema.find(query).exec()

      return usuarios
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseError(error, 'Erro ao buscar os usuários!')
    }
  }

  async incluir(pRegistro: UsuarioModel): Promise<UsuarioModel> {
    try {
      const usuario = new UsuarioSchema(pRegistro)

      return await usuario.save()
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseError(error, 'Erro ao incluir o usuário!')
    }
  }

  async atualizar(
    pId: string,
    pRegistro: UsuarioModel
  ): Promise<UsuarioModel | null> {
    try {
      // Converter o pId para ObjectId
      const objectId = stringToObjectIDMongo(pId)

      const updatedUsuario = await UsuarioSchema.findByIdAndUpdate(
        objectId,
        {
          role: pRegistro.role,
          nome: pRegistro.nome,
          email: pRegistro.email,
          senha: pRegistro.senha
        },
        { new: true }
      ).exec()

      return updatedUsuario
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseError(error, 'Erro ao atualizar o usuário!')
    }
  }

  async excluir(pId: string): Promise<UsuarioModel | null> {
    try {
      const usuarioDeletado = await UsuarioSchema.findByIdAndDelete(pId).exec()

      return usuarioDeletado
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseError(error, 'Erro ao excluir o usuário!')
    }
  }
}
