import {
  ForbiddenError,
  NotFoundError,
  InternalServiceError
} from '../../../domain/base/BaseError'

const ORIGEM_EXCEPTION = 'CronSchedule'

export class CronScheduleNotFoundException extends NotFoundError {
  constructor(pError: Error | any, pMensagem: string) {
    super(ORIGEM_EXCEPTION, pError, pMensagem)
  }
}

export class CronScheduleInternalServiceException extends InternalServiceError {
  constructor(pError: Error | any, pMensagem: string) {
    super(ORIGEM_EXCEPTION, pError, pMensagem)
  }
}

export class CronScheduleForbiddenException extends ForbiddenError {
  constructor(pError: Error | any, pMensagem: string) {
    super(ORIGEM_EXCEPTION, pError, pMensagem)
  }
}
