import {
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
  InternalServiceError
} from '../../../domain/base/BaseError'

const ORIGEM_EXCEPTION = 'Task'

export class TaskUnauthorizedException extends UnauthorizedError {
  constructor(pError: Error | any, pMensagem: string) {
    super(ORIGEM_EXCEPTION, pError, pMensagem)
  }
}

export class TaskForbiddenException extends ForbiddenError {
  constructor(pError: Error | any, pMensagem: string) {
    super(ORIGEM_EXCEPTION, pError, pMensagem)
  }
}

export class TaskNotFoundException extends NotFoundError {
  constructor(pError: Error | any, pMensagem: string) {
    super(ORIGEM_EXCEPTION, pError, pMensagem)
  }
}

export class TaskInteralServiceException extends InternalServiceError {
  constructor(pError: Error | any, pMensagem: string) {
    super(ORIGEM_EXCEPTION, pError, pMensagem)
  }
}
