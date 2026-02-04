import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  ExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { RpcErrorShape } from '../interfaces';

@Catch(RpcException)
export class HyperRpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const error = exception.getError() as RpcErrorShape;

    const statusMap: Record<number, number> = {
      3: HttpStatus.BAD_REQUEST,
      5: HttpStatus.NOT_FOUND,
      6: HttpStatus.CONFLICT,
      16: HttpStatus.UNAUTHORIZED,
    };

    const statusCode =
      statusMap[error.code] || HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(statusCode).json({
      statusCode,
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
