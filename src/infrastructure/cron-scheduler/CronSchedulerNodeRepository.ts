// Dependências
import schedule, { Job } from 'node-schedule'
import parser from 'cron-parser'

// Domain
import CronSchedulerRepository from '../../domain/cron-scheduler/CronSchedulerRepository'

// Shared
import Logger from '../../shared/utils/Logger'

export default class CronSchedulerNodeRepository
  implements CronSchedulerRepository
{
  private readonly logger: Logger
  private readonly scheduledTasks: Map<string, { job: Job; model: any }>

  constructor() {
    this.scheduledTasks = new Map()
    this.logger = new Logger(this.constructor.name)
  }

  agendarTarefa<Model>(
    pFrequenciaCron: string,
    pModel: Model,
    pCallbackIniciar: () => Promise<void>,
    pCallbackProcessar: () => Promise<void>,
    pCallbackFinalizar: () => Promise<void>,
    pCallbackErro: (pMensagemErro: string) => Promise<void>
  ): Model | null {
    try {
      // Crie uma função que será executada com base nas informações da task
      const job = schedule.scheduleJob(pFrequenciaCron, async () => {
        let taskinfo: any = pModel
        if (taskinfo.id) {
          taskinfo = taskinfo.id
        }

        try {
          this.logger.info(`Iniciando a execução da task ${taskinfo}...`)
          await pCallbackIniciar()

          this.logger.info(`Executando task ${taskinfo}...`)
          await pCallbackProcessar()

          this.logger.info(`Finalizando a execução da task ${taskinfo}...`)
          await pCallbackFinalizar()
        } catch (error) {
          this.logger.info(`Erro ao executar a task ${taskinfo}: ${error}`)
          await pCallbackErro(String(error))
        }
      })

      let taskinfo: any = pModel
      if (taskinfo.id) {
        taskinfo = taskinfo.id
      }

      // Armazene a tarefa agendada e o modelo de tarefa associado
      this.logger.info(`A tarefa ${taskinfo} foi agendada com sucesso`)
      this.scheduledTasks.set(taskinfo, { job, model: pModel })

      return pModel
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  listarTarefasAgendadas<T>(): T[] {
    try {
      const registros: T[] = []

      this.scheduledTasks.forEach((task) => {
        registros.push(task.model)
      })

      return registros
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  cancelarTarefaAgendada<T>(pTaskId: string): T | null {
    try {
      const task = this.scheduledTasks.get(pTaskId)
      if (task) {
        task.job.cancel() // Cancela a tarefa agendada
        this.scheduledTasks.delete(pTaskId) // Remova a entrada do registro
        return task.model // Retorne o modelo da tarefa
      }
      return null
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  traduzirExpressaoCron(pExpressao: string): string {
    try {
      const [minute, hour, dayOfMonth, month, dayOfWeek] = pExpressao.split(' ')

      const translateField = (field: string, fieldName: string): string => {
        if (field === '*') {
          return `todos os ${fieldName}`
        }

        if (field.includes('/')) {
          const [base, step] = field.split('/')
          if (base === '*') {
            return `a cada ${step} ${fieldName}`
          }
          return `de ${base} a cada ${step} ${fieldName}`
        }

        if (field.includes('-')) {
          const [start, end] = field.split('-')
          return `do ${start} ao ${end} ${fieldName}`
        }

        if (field.includes(',')) {
          const list = field.split(',').join(', ')
          return `${fieldName} ${list}`
        }

        return `${fieldName} ${field}`
      }

      const minuteText = translateField(minute, 'minutos')
      const hourText = translateField(hour, 'horas')
      const dayOfMonthText = translateField(dayOfMonth, 'dias do mês')
      const monthText = translateField(month, 'meses')
      const dayOfWeekText = translateField(dayOfWeek, 'dias da semana')

      return `${minuteText}, ${hourText}, ${dayOfMonthText}, ${monthText}, ${dayOfWeekText}`
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  // Função para prever a próxima execução
  preverProximaExecucao(pFrequenciaCron: string): string {
    try {
      const intervalo = parser.parseExpression(pFrequenciaCron)
      const proximaData = intervalo.next().toDate()
      return String(proximaData.toLocaleString())
    } catch (error) {
      this.logger.error(
        `Erro ao calcular a próxima execução para a expressão cron "${pFrequenciaCron}": ${error}`
      )
      throw error
    }
  }
}

// // Dependências
// import cron, { ScheduledTask } from 'node-cron';

// // Domain
// import TaskModel from '../../domain/task/TaskModel';
// import CronSchedulerRepository from '../../domain/cron-scheduler/CronSchedulerRepository';

// // Shared
// import Logger from '../../shared/utils/Logger';

// export default class CronSchedulerNodeRepository
//   implements CronSchedulerRepository
// {
//   private readonly logger: Logger;
//   private readonly scheduledTasks: Map<
//     string,
//     { cronTask: cron.ScheduleOptions & ScheduledTask; taskModel: TaskModel }
//   >;

//   constructor() {
//     this.scheduledTasks = new Map();
//     this.logger = new Logger(this.constructor.name);
//   }

//   agendarTarefa(pFrequenciaCron: string, pTask: TaskModel): TaskModel {
//     try {
//       // Crie uma função que será executada com base nas informações da task
//       const scheduledTask = cron.schedule(
//         pFrequenciaCron,
//         async () => {
//           try {
//             console.log(`Executando task ${pTask.id}...`);
//             // Exemplo: Atualizar o status da task para "EM PROCESSAMENTO"
//             pTask.status = TaskModel.EStatusTask.PROCESSANDO;

//             // TODO: Implemente a lógica específica da tarefa
//             // Exemplo: Atualizar status para "CONCLUÍDO"
//             pTask.status = TaskModel.EStatusTask.FINALIZADO;

//             console.log(`Task ${pTask.id} concluída.`);
//           } catch (error) {
//             pTask.status = TaskModel.EStatusTask.ERRO;
//             throw error;
//           }
//         },
//         { name: JSON.stringify(pTask) }, // Nomeio a tarefa como o MODEL da task
//       );

//       // Armazene a tarefa agendada e o modelo de tarefa associado
//       this.logger.info(`A tarefa ${pTask.id} foi agendada com sucesso`);
//       this.scheduledTasks.set(pTask.id, {
//         cronTask: scheduledTask,
//         taskModel: pTask,
//       });

//       return pTask;
//     } catch (error) {
//       this.logger.error(error);
//       throw error;
//     }
//   }

//   listarTarefasAgendadas(): TaskModel[] {
//     try {
//       const schedules = cron.getTasks();
//       const registros: TaskModel[] = [];

//       schedules.forEach((schedule: any) => {
//         const objeto = JSON.parse(schedule.options.name);
//         registros.push(new TaskModel(objeto));
//       });

//       return registros;
//     } catch (error) {
//       this.logger.error(error);
//       throw error;
//     }
//   }

//   iniciarAgendamentoDeTarefas(pTasks: TaskModel[]): TaskModel[] {
//     try {
//       pTasks.forEach((task) => {
//         this.agendarTarefa(task.frequencia, task.toObject());
//       });

//       return this.listarTarefasAgendadas();
//     } catch (error) {
//       this.logger.error(error);
//       throw error;
//     }
//   }

//   cancelarTarefaAgendada(pTaskId: string): TaskModel | null {
//     try {
//       const entry = this.scheduledTasks.get(pTaskId);
//       if (entry) {
//         entry.cronTask.stop(); // Pare a tarefa cron
//         this.scheduledTasks.delete(pTaskId); // Remova a entrada do registro
//         return entry.taskModel; // Retorne o modelo da tarefa
//       }
//       return null;
//     } catch (error) {
//       this.logger.error(error);
//       throw error;
//     }
//   }

//   traduzirExpressaoCron(pExpressao: string): string {
//     try {
//       const [minute, hour, dayOfMonth, month, dayOfWeek] =
//         pExpressao.split(' ');

//       const translateField = (field: string, fieldName: string): string => {
//         if (field === '*') {
//           return `todos os ${fieldName}`;
//         }

//         if (field.includes('/')) {
//           const [base, step] = field.split('/');
//           if (base === '*') {
//             return `a cada ${step} ${fieldName}`;
//           }
//           return `de ${base} a cada ${step} ${fieldName}`;
//         }

//         if (field.includes('-')) {
//           const [start, end] = field.split('-');
//           return `do ${start} ao ${end} ${fieldName}`;
//         }

//         if (field.includes(',')) {
//           const list = field.split(',').join(', ');
//           return `${fieldName} ${list}`;
//         }

//         return `${fieldName} ${field}`;
//       };

//       const minuteText = translateField(minute, 'minutos');
//       const hourText = translateField(hour, 'horas');
//       const dayOfMonthText = translateField(dayOfMonth, 'dias do mês');
//       const monthText = translateField(month, 'meses');
//       const dayOfWeekText = translateField(dayOfWeek, 'dias da semana');

//       return `${minuteText}, ${hourText}, ${dayOfMonthText}, ${monthText}, ${dayOfWeekText}`;
//     } catch (error) {
//       this.logger.error(error);
//       throw error;
//     }
//   }
// }
