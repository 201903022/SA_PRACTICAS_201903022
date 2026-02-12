import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  ExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

type RpcErrorShape = { code: number; message: string };

@Catch(RpcException)
export class HyperRpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const err = exception.getError() as RpcErrorShape;

    const statusMap: Record<number, number> = {
      3: HttpStatus.BAD_REQUEST, // INVALID_ARGUMENT
      5: HttpStatus.NOT_FOUND, // NOT_FOUND
      6: HttpStatus.CONFLICT, // ALREADY_EXISTS
      7: HttpStatus.FORBIDDEN, // PERMISSION_DENIED (opcional)
      16: HttpStatus.UNAUTHORIZED, // UNAUTHENTICATED
      13: HttpStatus.INTERNAL_SERVER_ERROR, // INTERNAL ✅
    };

    const statusCode = statusMap[err?.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({
      statusCode,
      message: err?.message ?? 'Unknown gRPC error',
      timestamp: new Date().toISOString(),
    });
  }
}
