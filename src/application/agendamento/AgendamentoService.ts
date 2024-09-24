// Domain
import TaskModel from '../../domain/task/TaskModel'
import UsuarioModel from '../../domain/usuario/UsuarioModel'
import AgendamentoModel from '../../domain/agendamento/AgendamentoModel'
import AgendamentoRepository from '../../domain/agendamento/AgendamentoRepository'

// Shared
import Logger from '../../shared/utils/Logger'

// Application
import TaskService from '../task/TaskService'
import CriarTaskDTO from '../task/dto/CriarTaskDTO'
import QueryTaskDTO from '../task/dto/QueryTaskDTO'
import UsuarioService from '../usuario/UsuarioService'
import SessaoAuthDTO from '../security/dto/SessaoAuthDTO'
import CriarAgendamentoDTO from './dto/CriarAgendamentoDTO'
import QueryAgendamentoDTO from './dto/QueryAgendamentoDTO'
import AtualizarTaskDTO from '../task/dto/AtualizarTaskDTO'
import QueryUsuarioDTO from '../usuario/dto/QueryUsuarioDTO'
import AtualizarAgendamentoDTO from './dto/AtualizarAgendamentoDTO'
import {
  AgendamentoForbiddenException,
  AgendamentoInternalServiceException,
  AgendamentoNotFoundException
} from './exceptions/AgendamentoExceptions'

export default class AgendamentoService {
  private readonly logger: Logger
  private readonly taskService: TaskService
  private readonly usuarioService: UsuarioService
  private readonly agendamentoRepository: AgendamentoRepository

  constructor(
    pAgendamentoRepository: AgendamentoRepository,
    pUsuarioService: UsuarioService,
    pTaskService: TaskService
  ) {
    this.taskService = pTaskService
    this.usuarioService = pUsuarioService
    this.agendamentoRepository = pAgendamentoRepository
    this.logger = new Logger(this.constructor.name)
  }

  async incluir(
    pSessao: SessaoAuthDTO,
    pRegistro: CriarAgendamentoDTO
  ): Promise<AgendamentoModel> {
    try {
      //Usuarios comuns não podem agendar para outros
      if (pSessao.role == UsuarioModel.ERoleUsuario.CLIENTE) {
        // Aplicar validação para não permitir agendar
      }

      // Verifica se o usuário existe
      const queryUsuaro = new QueryUsuarioDTO({
        id: pRegistro.usuarioCriacaoId
      })
      const usuarios = await this.usuarioService.buscar(queryUsuaro)

      if (!usuarios || usuarios.length == 0) {
        throw new AgendamentoNotFoundException(
          '',
          `O usuário ${pRegistro.usuarioCriacaoId} não foi encontrado`
        )
      }

      // Verifica se já existe um agendamento idêntico
      const agendamentos = await this.agendamentoRepository.buscar({
        frequencia: pRegistro.frequencia,
        tipoAgendamento: pRegistro.tipoAgendamento
      })

      if (agendamentos && agendamentos.length > 0) {
        const agendamento = new AgendamentoModel(agendamentos[0])
        throw new AgendamentoForbiddenException(
          '',
          `Já existe um agendamento com as mesmas especificações de tempo e filtros! ID: ${agendamento.id}`
        )
      }

      // Cria o agendamento
      let novoAgendamento = pRegistro.toDomain()
      novoAgendamento.usuarioCriacaoId = pSessao.id
      novoAgendamento.usuarioAlteracaoId = pSessao.id

      novoAgendamento =
        await this.agendamentoRepository.incluir(novoAgendamento)

      // Cria a tarefa
      let task = new TaskModel({
        agendamentoId: novoAgendamento.id,
        status: TaskModel.EStatusTask.AGENDADO,
        frequencia: novoAgendamento.frequencia,
        tipoAgendamento: novoAgendamento.tipoAgendamento
      })

      task = await this.taskService.incluir(new CriarTaskDTO(task))

      // Agendando a tarefa cron
      this.taskService.agendarTask(
        task,
        async () => {},
        async () => {},
        async () => {},
        async () => {}
      )

      return novoAgendamento.toObject()
    } catch (error) {
      this.logger.error(error)
      throw new AgendamentoInternalServiceException(
        error,
        'Erro ao incluir agendamento!'
      )
    }
  }

  async buscar(pParams: QueryAgendamentoDTO): Promise<AgendamentoModel[]> {
    try {
      const registros = await this.agendamentoRepository.buscar(pParams)

      return registros
    } catch (error) {
      this.logger.error(error)
      throw new AgendamentoInternalServiceException(
        error,
        'Erro ao buscar agendamentos!'
      )
    }
  }

  async excluir(
    pSessaoUsuario: SessaoAuthDTO,
    pId: string
  ): Promise<AgendamentoModel> {
    try {
      // Consulta o agendamento
      const registros = await this.buscar(new QueryAgendamentoDTO({ id: pId }))
      if (!registros || registros.length == 0) {
        throw new AgendamentoNotFoundException(
          '',
          'Agendamento não encontrado para exclusão!'
        )
      }

      // Verifica se o usuário tem permissão para excluir
      const agendamento = registros[0]
      if (pSessaoUsuario.role == UsuarioModel.ERoleUsuario.CLIENTE) {
        // Verifica se o usuário tem permissão para excluir
      }

      // Realiza a exclusão
      await this.agendamentoRepository.excluir(pId)

      return agendamento
    } catch (error) {
      this.logger.error(error)
      throw new AgendamentoInternalServiceException(
        error,
        'Erro ao excluir agendamento!'
      )
    }
  }

  async atualizar(
    pSessaoUsuario: SessaoAuthDTO,
    pId: string,
    pRegistro: AtualizarAgendamentoDTO
  ): Promise<AgendamentoModel> {
    try {
      // Consulta o agendamento
      const registros = await this.buscar(new QueryAgendamentoDTO({ id: pId }))
      console.log(registros)
      if (!registros || registros.length == 0) {
        throw new AgendamentoNotFoundException(
          '',
          'Agendamento não encontrado para atualização!'
        )
      }

      // Verifica se o usuário tem permissão para excluir
      const agendamento = registros[0]
      if (pSessaoUsuario.role == UsuarioModel.ERoleUsuario.CLIENTE) {
        // Verifica se o usuário tem permissão para excluir
      }

      // Atualiza o agendamento
      const agendamentoAtualizado = pRegistro.toDomain()
      agendamentoAtualizado.usuarioAlteracaoId = pSessaoUsuario.id

      await this.agendamentoRepository.atualizar(pId, {
        ...agendamentoAtualizado
      })

      // Consulta a tarefa associada
      const tasksExistentes = await this.taskService.buscar(
        new QueryTaskDTO({
          agendamentoId: agendamento.id,
          status: TaskModel.EStatusTask.AGENDADO
        })
      )

      if (!tasksExistentes || tasksExistentes.length == 0) {
        // Se não existir a tarefa com status AGENDADO, cria uma nova com os dados atualizados
        let novaTask = new TaskModel({
          percentual: 0,
          frequencia: agendamento.frequencia,
          status: TaskModel.EStatusTask.AGENDADO,
          tipoAgendamento: agendamento.tipoAgendamento
        })

        novaTask = await this.taskService.incluir(new CriarTaskDTO(novaTask))
        this.taskService.agendarTarefaConformeTipoAgendamento(
          agendamento.tipoAgendamento,
          novaTask
        )
      } else {
        // Se existir a tarefa com status AGENDADO, atualiza com os dados atualizados
        const taskAtualizada = new TaskModel({
          id: tasksExistentes[0].id,
          agendamentoId: agendamento.id,
          frequencia: agendamento.frequencia,
          status: TaskModel.EStatusTask.AGENDADO,
          percentual: tasksExistentes[0].percentual,
          tipoAgendamento: agendamento.tipoAgendamento
        })

        await this.taskService.atualizar(
          taskAtualizada.id,
          new AtualizarTaskDTO(taskAtualizada)
        )
      }

      return agendamento
    } catch (error) {
      this.logger.error(error)
      throw new AgendamentoInternalServiceException(
        error,
        'Erro ao atualizar agendamento!'
      )
    }
  }
}
