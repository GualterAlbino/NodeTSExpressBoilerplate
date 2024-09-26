// Domain
import UsuarioModel from '../../../domain/usuario/UsuarioModel'
import UsuarioRepository from '../../../domain/usuario/UsuarioRepository'

// Aplication
import QueryTaskDTO from '../../../application/task/dto/QueryTaskDTO'

// Shared
import Logger from '../../../shared/utils/Logger'

// Infra
import UsuarioSchema from '../../../infrastructure/mongo/schemas/UsuarioSchema'
import { queryBuilder } from '../../../infrastructure/mongo/utils/QueryBuilder'
import { stringToObjectIDMongo } from '../../../infrastructure/mongo/utils/StringToObjectIDMongo'

export default class UsuarioMongoRepository implements UsuarioRepository {
  private readonly logger = new Logger(this.constructor.name)

  async buscar(pParams: QueryTaskDTO): Promise<UsuarioModel[]> {
    try {
      const query = queryBuilder(pParams)

      const usuarios = await UsuarioSchema.find(query).exec()

      return usuarios.map((usuario) => new UsuarioModel(usuario))
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async incluir(pRegistro: UsuarioModel): Promise<UsuarioModel> {
    try {
      const registro = pRegistro

      console.log('Registr: ', registro)

      const usuario = await new UsuarioSchema(pRegistro).save()

      return new UsuarioModel(usuario)
    } catch (error) {
      this.logger.error(error)
      throw error
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

      return updatedUsuario ? new UsuarioModel(updatedUsuario) : null
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async excluir(pId: string): Promise<UsuarioModel | null> {
    try {
      const usuarioDeletado = await UsuarioSchema.findByIdAndDelete(pId).exec()

      return usuarioDeletado ? new UsuarioModel(usuarioDeletado) : null
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }
}
