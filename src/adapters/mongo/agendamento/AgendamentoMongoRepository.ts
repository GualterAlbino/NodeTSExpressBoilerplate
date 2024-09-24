// Domain
import AgendamentoModel from '../../../domain/agendamento/AgendamentoModel'
import AgendamentoRepository from '../../../domain/agendamento/AgendamentoRepository'

// Infra
import { queryBuilder } from '../../../infrastructure/mongo/utils/QueryBuilder'
import AgendamentoSchema from '../../../infrastructure/mongo/schemas/AgendamentoSchema'

// Shared
import Logger from '../../../shared/utils/Logger'

// Application
import QueryAgendamentoDTO from '../../../application/agendamento/dto/QueryAgendamentoDTO'

// Constantes
import {
  cTABELA_USUARIO,
  cTABELA_AGENDAMENTO_FOREIGNKEY_USUARIO
} from '../../../infrastructure/mongo/constants/ConstantesMongoDB'

export default class AgendamentoMongoRepository
  implements AgendamentoRepository
{
  private readonly logger: Logger

  constructor() {
    this.logger = new Logger(this.constructor.name)
  }

  async buscar(
    pParams: Partial<QueryAgendamentoDTO>
  ): Promise<AgendamentoModel[]> {
    try {
      const query = queryBuilder(pParams)
      const agendamentos = await AgendamentoSchema.find(query).exec()
      return agendamentos.map(
        (agendamento) => new AgendamentoModel(agendamento)
      )
      /*
      const agendamentos = await AgendamentoSchema.aggregate([
        {
          $lookup: {
            from: cTABELA_USUARIO, // Nome da coleção MongoDB (note que é case-sensitive)
            localField: cTABELA_AGENDAMENTO_FOREIGNKEY_USUARIO, // Campo do agendamento que faz referência ao usuário
            foreignField: '_id', // Campo do usuário que é referenciado
            as: 'usuario',
          },
        },
        {
          $unwind: {
            path: '$usuario',
            preserveNullAndEmptyArrays: true, // Mantém o documento mesmo se não houver correspondência
          },
        },
        {
          $match: query,
        },
      ]);

      const registros: {
        agendamento: AgendamentoModel;
        usuario: UsuarioModel;
      }[] = [];
      agendamentos.forEach((agendamento: any) => {
        registros.push({
          agendamento: new AgendamentoModel(agendamento),
          usuario: new UsuarioModel(agendamento.usuario),
        });
      });

      return registros;

      //   const agendamentos = await AgendamentoSchema.find(query)
      // .populate('usuarioId', 'nome email') // Popula os campos desejados do usuário (nome e email)
      // .exec();
      */
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async incluir(pRegistro: AgendamentoModel): Promise<AgendamentoModel> {
    try {
      const agendamento = await new AgendamentoSchema(pRegistro).save()

      return new AgendamentoModel(agendamento)
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async atualizar(
    pId: string,
    pRegistro: Partial<AgendamentoModel>
  ): Promise<AgendamentoModel | null> {
    try {
      const agendamento = await AgendamentoSchema.findByIdAndUpdate(
        pRegistro.id,
        pRegistro,
        { new: true }
      )

      if (agendamento) {
        return new AgendamentoModel(agendamento)
      }

      return null
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async excluir(pId: string): Promise<AgendamentoModel | null> {
    try {
      const agendamento = await AgendamentoSchema.findByIdAndDelete(pId)

      if (agendamento) {
        return new AgendamentoModel(agendamento)
      }

      return null
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }
}
