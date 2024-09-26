// Bibliotecas
import { Repository } from 'typeorm'

// Domain
import AgendamentoModel from '../../../domain/agendamento/AgendamentoModel'
import AgendamentoRepository from '../../../domain/agendamento/AgendamentoRepository'

// Shared
import Logger from '../../../shared/utils/Logger'

// Infra
import PostgresConfig from '../../../infrastructure/postgres/PostgresConfig'
import { validarUUID } from '../../../infrastructure/postgres/utils/ValidateStringUUID'
import AgendamentoEntity from '../../../infrastructure/postgres/entities/AgendamentoEntity'

export default class AgendamentoPostgresRepository
  implements AgendamentoRepository
{
  private readonly logger: Logger
  private readonly agendamentoRepository: Repository<AgendamentoEntity>

  constructor() {
    this.logger = new Logger(this.constructor.name)

    // Usando a instância Singleton de PostgresConfig
    const postgresConfig = PostgresConfig.getInstance()
    this.agendamentoRepository = postgresConfig
      .getDataSource()
      .getRepository(AgendamentoEntity)
  }

  // Método para buscar usuários
  async buscar(
    pParams: Partial<AgendamentoModel>
  ): Promise<AgendamentoModel[]> {
    try {
      const agendamentos = await this.agendamentoRepository.find({
        where: pParams
      })
      return agendamentos.map(
        (agendamento) => new AgendamentoModel(agendamento)
      )
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async incluir(pRegistro: AgendamentoModel): Promise<AgendamentoModel> {
    try {
      validarUUID(pRegistro.usuarioCriacaoId, 'usuarioCriacaoId')

      const agendamento = await this.agendamentoRepository.save(pRegistro)
      return new AgendamentoModel(agendamento)
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async excluir(pId: string): Promise<AgendamentoModel | null> {
    try {
      validarUUID<AgendamentoModel>(pId, 'id')

      const agendamentos = await this.agendamentoRepository.findBy({ id: pId })
      if (!agendamentos || agendamentos.length === 0) {
        return null
      }

      const { raw, affected } = await this.agendamentoRepository.delete(pId)

      if (affected === 0) {
        return null
      }

      return new AgendamentoModel(agendamentos[0])
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async atualizar(
    pId: string,
    pRegistro: AgendamentoModel
  ): Promise<AgendamentoModel | null> {
    try {
      validarUUID<AgendamentoModel>(pId, 'id')

      // Verifica se o usuário existe
      const agendamentos = await this.agendamentoRepository.findBy({ id: pId })
      if (!agendamentos || agendamentos.length === 0) {
        return null
      }

      // Atualiza
      const registro = pRegistro.toObject()

      const { raw, affected } = await this.agendamentoRepository.update(pId, {
        status: registro.status,
        frequencia: registro.frequencia,
        alteradoEm: registro.alteradoEm,
        tipoAgendamento: registro.tipoAgendamento
      })

      if (affected === 0) {
        return null
      }

      return new AgendamentoModel(registro)
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }
}
