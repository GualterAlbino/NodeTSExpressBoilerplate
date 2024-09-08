//DTOs
import { QueryUsuarioDTO } from './dto/QueryUsuarioDTO'
import { CriarUsuarioDTO } from './dto/CriarUsuarioDTO'
import { ListarUsuarioDTO } from './dto/ListarUsuarioDTO'
import { AtualizarUsuarioDTO } from './dto/AtualizarUsuarioDTO'

//Domain
import UsuarioRepository from '../../domain/usuario/UsuarioRepository'
import {
  InternalServiceError,
  NotFoundError
} from '../../domain/base/BaseError'

//Shared
import Logger from '../../shared/utils/Logger'
import UsuarioModel from '../../domain/usuario/UsuarioModel'

export default class UsuarioService {
  private usuarioRepository: UsuarioRepository
  private readonly logger = new Logger(this.constructor.name)

  constructor(pUsuarioRepository: UsuarioRepository) {
    this.usuarioRepository = pUsuarioRepository
  }

  async incluir(pRegistro: CriarUsuarioDTO): Promise<ListarUsuarioDTO> {
    try {
      const usuarios = await this.usuarioRepository.buscar({
        email: pRegistro.email
      })

      if (usuarios.length > 0) {
        throw new InternalServiceError(
          '',
          'Este e-mail já está sendo utilizado por outro usuário!'
        )
      }

      const usuario = await this.usuarioRepository.incluir(pRegistro.toDomain())

      return new ListarUsuarioDTO(usuario)
    } catch (error) {
      this.logger.error(error)
      throw new InternalServiceError(error, 'Erro ao incluir usuário!')
    }
  }

  async atualizar(
    pId: string,
    pRegistro: AtualizarUsuarioDTO
  ): Promise<ListarUsuarioDTO> {
    try {
      const updatedUsuario = await this.usuarioRepository.atualizar(
        pId,
        pRegistro.toDomain()
      )

      if (!updatedUsuario) {
        throw new NotFoundError('', 'Usuário não encontrado para atualização!')
      }

      return new ListarUsuarioDTO(updatedUsuario)
    } catch (error) {
      this.logger.error(error)
      throw new InternalServiceError(error, 'Erro ao atualizar o usuário!')
    }
  }

  async buscar(pParams: QueryUsuarioDTO): Promise<ListarUsuarioDTO[]> {
    try {
      const usuarios = await this.usuarioRepository.buscar(pParams)
      return usuarios.map((usuario) => new ListarUsuarioDTO(usuario))
    } catch (error) {
      this.logger.error(error)
      throw new InternalServiceError(error, 'Erro ao buscar os usuários!')
    }
  }

  async buscarPorEmail(pEmail: string): Promise<UsuarioModel[]> {
    try {
      const usuarios = await this.usuarioRepository.buscar({ email: pEmail })
      return usuarios
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServiceError(
        error,
        'Erro ao buscar os usuários por email!'
      )
    }
  }

  async excluir(pId: string): Promise<ListarUsuarioDTO> {
    try {
      const usuarioDeletado = await this.usuarioRepository.excluir(pId)

      if (!usuarioDeletado) {
        throw new NotFoundError('', 'Usuário não encontrado para exclusão!')
      }

      return new ListarUsuarioDTO(usuarioDeletado)
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServiceError(error, 'Erro ao excluir o usuário!')
    }
  }
}
