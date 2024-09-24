import AgendamentoService from '../../../application/agendamento/AgendamentoService';

// Application
import CriarAgendamentoDTO from '../../../application/agendamento/dto/CriarAgendamentoDTO';

// Shared
import Logger from '../../../shared/utils/Logger';
import SessaoAuthDTO from '../../../application/security/dto/SessaoAuthDTO';
import QueryAgendamentoDTO from '../../../application/agendamento/dto/QueryAgendamentoDTO';
import ListarAgendamentoDTO from '../../../application/agendamento/dto/ListarAgendamentoDTO';
import AtualizarAgendamentoDTO from '../../../application/agendamento/dto/AtualizarAgendamentoDTO';

export default class AgendamentoHandler {
  private readonly logger: Logger;
  private readonly agendamentoService: AgendamentoService;

  constructor(pAgendamentoService: AgendamentoService) {
    this.logger = new Logger(this.constructor.name);
    this.agendamentoService = pAgendamentoService;
  }

  async incluir(
    pSessao: SessaoAuthDTO,
    pRegistro: CriarAgendamentoDTO,
  ): Promise<any> {
    try {
      const registro = await this.agendamentoService.incluir(
        pSessao,
        pRegistro,
      );

      return new ListarAgendamentoDTO(registro);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async buscar(pParams: QueryAgendamentoDTO): Promise<ListarAgendamentoDTO[]> {
    try {
      const retorno = await this.agendamentoService.buscar(pParams);

      return retorno.map((registro) => new ListarAgendamentoDTO(registro));
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async excluir(
    pSessaoUsuario: SessaoAuthDTO,
    pId: string,
  ): Promise<ListarAgendamentoDTO> {
    try {
      const registro = await this.agendamentoService.excluir(
        pSessaoUsuario,
        pId,
      );

      return new ListarAgendamentoDTO(registro);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async atualizar(
    pSessaoUsuario: SessaoAuthDTO,
    pId: string,
    pRegistro: AtualizarAgendamentoDTO,
  ): Promise<ListarAgendamentoDTO> {
    try {
      const agendamento = await this.agendamentoService.atualizar(
        pSessaoUsuario,
        pId,
        pRegistro,
      );

      return new ListarAgendamentoDTO(agendamento);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
