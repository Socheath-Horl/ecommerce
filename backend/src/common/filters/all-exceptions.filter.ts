import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { MulterError } from 'multer';

interface ErrorShape {
  code: string;
  message: string;
  details?: string[];
}

const MULTER_MESSAGES: Record<string, string> = {
  LIMIT_FILE_SIZE: 'File too large',
  LIMIT_FILE_COUNT: 'Too many files',
  LIMIT_UNEXPECTED_FILE: 'Unexpected field',
};

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
    if (exception instanceof MulterError) return HttpStatus.BAD_REQUEST;
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
    if (exception instanceof MulterError) {
      return {
        code: 'BAD_REQUEST',
        message: MULTER_MESSAGES[exception.code] ?? 'File upload failed',
        details: [exception.code],
      };
    }
    this.logger.error(exception instanceof Error ? exception.stack ?? exception.message : String(exception));
    return { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' };
  }
}