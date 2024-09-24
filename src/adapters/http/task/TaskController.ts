//Express
import { NextFunction, Request, Response } from 'express';

//Shared
import Logger from '../../../shared/utils/Logger';

// Application
import CriarTaskDTO from '../../../application/task/dto/CriarTaskDTO';
import QueryTaskDTO from '../../../application/task/dto/QueryTaskDTO';
import AtualizarTaskDTO from '../../../application/task/dto/AtualizarTaskDTO';

// Adapters
import TaskHandler from './TaskHandler';

export default class TaskController {
  private taskHandler: TaskHandler;
  private readonly logger = new Logger(this.constructor.name);

  constructor(pTaskHandler: TaskHandler) {
    this.taskHandler = pTaskHandler;
  }

  async incluir(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const body = req.body;
      const dto = new CriarTaskDTO(body);

      const retorno = await this.taskHandler.incluir(dto);
      res.status(201).send(retorno);
    } catch (error) {
      this.logger.error(error);
      next(error);
    }
  }

  async buscar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const queryParams = new QueryTaskDTO(req.body);
      const tasks = await this.taskHandler.buscar(queryParams);
      res.status(200).json(tasks);
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
      const retorno = await this.taskHandler.excluir(params.id);
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
      const dto = new AtualizarTaskDTO(body);

      const retorno = await this.taskHandler.atualizar(params.id, dto);
      res.status(200).send(retorno);
    } catch (error) {
      this.logger.error(error);
      next(error);
    }
  }
}
