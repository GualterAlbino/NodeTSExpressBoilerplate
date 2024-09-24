//Express
import { NextFunction, Request, Response } from 'express';

//Shared
import Logger from '../../../shared/utils/Logger';

// Application
import CriarAgendamentoDTO from '../../../application/agendamento/dto/CriarAgendamentoDTO';

import AgendamentoHandler from './AgendamentoHandler';
import SessaoAuthDTO from '../../../application/security/dto/SessaoAuthDTO';
import QueryAgendamentoDTO from '../../../application/agendamento/dto/QueryAgendamentoDTO';
import AtualizarAgendamentoDTO from '../../../application/agendamento/dto/AtualizarAgendamentoDTO';

export default class AgendamentoController {
  private agendamentoHandler: AgendamentoHandler;
  private readonly logger = new Logger(this.constructor.name);

  constructor(pAgendamentoHandler: AgendamentoHandler) {
    this.agendamentoHandler = pAgendamentoHandler;
  }

  async incluir(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const body = req.body;
      const jwtPayload = req.sessao;
      const dto = new CriarAgendamentoDTO(body);
      const sessao = new SessaoAuthDTO(jwtPayload);

      const retorno = await this.agendamentoHandler.incluir(sessao, dto);
      res.status(201).send(retorno);
    } catch (error) {
      this.logger.error(error);
      next(error);
    }
  }

  async buscar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body;
      const queryParams = new QueryAgendamentoDTO(body);

      const retorno = await this.agendamentoHandler.buscar(queryParams);
      res.status(200).send(retorno);
    } catch (error) {
      this.logger.error(error);
      next(error);
    }
  }

  async excluir(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const params = req.params;
      const jwtPayload = req.sessao;
      const sessao = new SessaoAuthDTO(jwtPayload);

      const retorno = await this.agendamentoHandler.excluir(sessao, params.id);
      res.status(200).send(retorno);
    } catch (error) {
      this.logger.error(error);
      next(error);
    }
  }

  async atualizar(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const body = req.body;
      const params = req.params;
      const jwtPayload = req.sessao;
      const sessao = new SessaoAuthDTO(jwtPayload);
      const dto = new AtualizarAgendamentoDTO(body);

      const retorno = await this.agendamentoHandler.atualizar(
        sessao,
        params.id,
        dto,
      );
      res.status(200).send(retorno);
    } catch (error) {
      this.logger.error(error);
      next(error);
    }
  }
}
