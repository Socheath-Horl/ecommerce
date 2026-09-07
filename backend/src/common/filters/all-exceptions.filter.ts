import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorShape {
  code: string;
  message: string;
  details?: string[];
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const body = {
      success: false,
      error: this.resolveError(exception),
    };
    res.status(this.resolveStatus(exception)).json(body);
  }

  private resolveStatus(exception: unknown): number {
    if (exception instanceof HttpException) return exception.getStatus();
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private resolveError(exception: unknown): ErrorShape {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const rawMessage =
        typeof response === 'string' ? response : (response as { message?: string | string[] }).message ?? exception.message;
      const message = Array.isArray(rawMessage) ? 'Validation failed' : rawMessage;
      const details = Array.isArray(rawMessage) ? rawMessage : undefined;
      return { code: HttpStatus[status] as string, message, ...(details ? { details } : {}) };
    }
    this.logger.error(exception instanceof Error ? exception.stack ?? exception.message : String(exception));
    return { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' };
  }
}