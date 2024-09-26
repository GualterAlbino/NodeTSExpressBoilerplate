// DTOs
import QueryTaskDTO from './dto/QueryTaskDTO'
import CriarTaskDTO from './dto/CriarTaskDTO'
import AtualizarTaskDTO from './dto/AtualizarTaskDTO'
import SessaoAuthDTO from '../security/dto/SessaoAuthDTO'

// Domain
import TaskModel from '../../domain/task/TaskModel'
import UsuarioModel from '../../domain/usuario/UsuarioModel'
import TaskRepository from '../../domain/task/TaskRepository'

// Shared
import Logger from '../../shared/utils/Logger'

// Application
import {
  TaskInteralServiceException,
  TaskNotFoundException
} from './exceptions/TaskExceptions'

import CronScheduleService from '../cron-scheduler/CronScheduleService'
import AgendamentoModel from '../../domain/agendamento/AgendamentoModel'

export default class TaskService {
  private readonly logger: Logger
  private readonly taskRepository: TaskRepository
  private readonly cronSchedulerService: CronScheduleService

  constructor(
    pTaskRepository: TaskRepository,
    pCronSchedulerService: CronScheduleService
  ) {
    this.taskRepository = pTaskRepository
    this.logger = new Logger(this.constructor.name)
    this.cronSchedulerService = pCronSchedulerService
  }

  async incluir(pRegistro: CriarTaskDTO): Promise<TaskModel> {
    try {
      // Se existir uma tarefa com os mesmos dados e agendada, não permitir a inclusão
      const registros = await this.taskRepository.buscar({
        frequencia: pRegistro.frequencia,
        agendamentoId: pRegistro.agendamentoId,
        status: TaskModel.EStatusTask.AGENDADO,
        tipoAgendamento: pRegistro.tipoAgendamento
      })

      if (registros.length > 0) {
        throw new TaskInteralServiceException(
          '',
          `Já existe uma tarefa com as mesmas especificações de tempo e filtros agendada! ID: ${registros[0].toObject().id}`
        )
      }

      const task = await this.taskRepository.incluir(pRegistro.toDomain())

      return task
    } catch (error) {
      this.logger.error(error)
      throw new TaskInteralServiceException(error, 'Erro ao incluir tarefa!')
    }
  }

  async atualizar(
    pId: string,
    pRegistro: AtualizarTaskDTO
  ): Promise<TaskModel> {
    try {
      const updatedTask = await this.taskRepository.atualizar(
        pId,
        pRegistro.toDomain()
      )

      if (!updatedTask) {
        throw new TaskNotFoundException(
          '',
          'Tarefa não encontrada para atualização!'
        )
      }

      return updatedTask
    } catch (error) {
      this.logger.error(error)
      throw new TaskInteralServiceException(error, 'Erro ao atualizar tarefa!')
    }
  }

  async buscar(pParams: QueryTaskDTO): Promise<TaskModel[]> {
    try {
      const tasks = await this.taskRepository.buscar(pParams)
      return tasks
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async excluir(pId: string): Promise<TaskModel> {
    try {
      const task = await this.taskRepository.excluir(pId)

      if (!task) {
        throw new TaskNotFoundException(
          '',
          'Tarefa não encontrada para exclusão!'
        )
      }
      return task
    } catch (error) {
      this.logger.error(error)
      throw new TaskInteralServiceException(error, 'Erro ao excluir tarefa!')
    }
  }

  async agendarTarefaConformeTipoAgendamento(
    pTipoAgendamento: string,
    pTask: TaskModel
  ): Promise<boolean> {
    try {
      switch (pTipoAgendamento) {
        case AgendamentoModel.ETipoAgendamento.TIPOA:
          // Agendar conforme o tipo de tarefa
          throw `O tipo de agendamento: ${pTipoAgendamento} não foi implementado!`
        case AgendamentoModel.ETipoAgendamento.TIPOB:
          // Agendar conforme o tipo de tarefa
          throw `O tipo de agendamento: ${pTipoAgendamento} não foi implementado!`
        case AgendamentoModel.ETipoAgendamento.TIPOC:
          // Agendar conforme o tipo de tarefa
          throw `O tipo de agendamento: ${pTipoAgendamento} não foi implementado!`
        default:
          throw new TaskInteralServiceException(
            '',
            `O tipo de agendamento: ${pTipoAgendamento} não foi encontrado!`
          )
      }
    } catch (error) {
      this.logger.error(error)
      throw new TaskInteralServiceException(
        error,
        'Erro definir o tipo de tarefa a ser agendada!'
      )
    }
  }

  async agendarTask(
    pTask: TaskModel,
    pCallbackIniciar: () => Promise<void>,
    pCallbackProcessar: () => Promise<void>,
    pCallbackFinalizar: () => Promise<void>,
    pCallbackErro: (pMensagemErro: string) => Promise<void>
  ): Promise<boolean> {
    try {
      const task = pTask.toObject()
      this.cronSchedulerService.agendarTarefa(
        task.frequencia,
        task,
        //Iniciar
        async () => {
          task.status = TaskModel.EStatusTask.EM_ESPERA
          await this.taskRepository.atualizar(task.id, task)
          await pCallbackIniciar()
        },

        //Processar
        async () => {
          task.status = TaskModel.EStatusTask.PROCESSANDO
          await this.taskRepository.atualizar(task.id, task)
          await pCallbackProcessar()
        },

        //Finalizar
        async () => {
          await pCallbackFinalizar()

          //Finaliza a tarefa
          task.status = TaskModel.EStatusTask.FINALIZADO
          await this.taskRepository.atualizar(task.id, task)

          //Cancela a tarefa no agendador
          this.cronSchedulerService.cancelarTarefaAgendada(task.id)

          //Verifa se já existe uma tarefa agendada
          const tarefas = await this.taskRepository.buscar({
            frequencia: task.frequencia,
            agendamentoId: task.agendamentoId,
            tipoAgendamento: task.tipoAgendamento,
            status: TaskModel.EStatusTask.AGENDADO
          })

          //Se já existir não é necessário criar uma nova
          if (tarefas.length > 0) {
            return
          }

          //Cria uma nova tarefa com os mesmos dados
          task.status = TaskModel.EStatusTask.AGENDADO
          const novaTtask = await this.incluir(new CriarTaskDTO(task))

          //Agenda a nova tarefa
          const agendou = this.agendarTask(
            novaTtask,
            pCallbackIniciar,
            pCallbackProcessar,
            pCallbackFinalizar,
            pCallbackErro
          )
          if (!agendou) {
            throw new TaskInteralServiceException(
              '',
              'Erro ao agendar a nova tarefa!'
            )
          }
        },

        //Erro
        async (pMensagemErro: string) => {
          task.mensagem = pMensagemErro
          task.status = TaskModel.EStatusTask.ERRO
          await this.taskRepository.atualizar(task.id, task)
          await pCallbackErro(pMensagemErro)
        }
      )

      this.logger.info(`Tarefa agendada com sucesso! ID: ${task.id}`)
      return true
    } catch (error) {
      this.logger.error(error)
      throw new TaskInteralServiceException(error, 'Erro ao agendar tarefa!')
    }
  }

  async inicializarTarefasCron(): Promise<boolean> {
    try {
      /*
      const tarefas = await this.taskRepository.buscar({
        status: TaskModel.EStatusTask.AGENDADO
      })

      tarefas.forEach((task) => {
        if (task.tipoAgendamento === AgendamentoModel.ETipoAgendamento.TIPOA) {
          this.agendarTask(
            task,
            async () => {},
            async () => {},
            async () => {},
            async () => {}
          )
        } else if (
          task.tipoAgendamento === AgendamentoModel.ETipoAgendamento.TIPOB
        ) {
          this.agendarTask(
            task,
            async () => {},
            async () => {},
            async () => {},
            async () => {}
          )
        } else if (
          task.tipoAgendamento === AgendamentoModel.ETipoAgendamento.TIPOC
        ) {
          this.agendarTask(
            task,
            async () => {},
            async () => {},
            async () => {},
            async () => {}
          )
        }
      })

      this.logger.info(
        `Realizado o agendamento de ${tarefas.length} ${tarefas.length > 1 || tarefas.length == 0 ? 'tarefas' : 'tarefa'}.`
      )
        */
      return true
    } catch (error) {
      this.logger.error(error)
      throw new TaskInteralServiceException(
        error,
        'Erro ao inicializar tarefas cron!'
      )
    }
  }

  async listarTarefasAgendadas(
    pSessaoUsuario: SessaoAuthDTO
  ): Promise<TaskModel[]> {
    try {
      const tasks: TaskModel[] = []
      const tasksAgendadas =
        this.cronSchedulerService.listarTarefasAgendadas<TaskModel>()

      tasksAgendadas.forEach((task) => {
        // Aplicar restrições de visualização
        tasks.push(task)
      })

      return tasks
    } catch (error) {
      this.logger.error(error)
      throw new TaskInteralServiceException(
        error,
        'Erro ao listar tarefas scheduladas!'
      )
    }
  }
}
