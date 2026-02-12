import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HyperHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const statusCode = exception.getStatus();
    const body = exception.getResponse();

    res.status(statusCode).json({
      statusCode,
      message:
        typeof body === 'string' ? body : ((body as any).message ?? body),
      timestamp: new Date().toISOString(),
    });
  }
}
