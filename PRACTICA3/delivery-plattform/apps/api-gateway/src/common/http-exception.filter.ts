import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
@Catch(RpcException)
export class HyperRpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const raw = exception.getError() as any;

    // 1) code normal
    let code: number | undefined = raw?.code;

    // 2) HOTFIX: si code viene 13 pero el mensaje trae "3 INVALID_ARGUMENT: ..."
    const msg: string = raw?.message ?? 'Unknown error';
    const m = msg.match(/^(\d+)\s+[A-Z_]+:/); // captura "3" en "3 INVALID_ARGUMENT:"
    if (m) code = Number(m[1]);

    const statusMap: Record<number, number> = {
      3: HttpStatus.BAD_REQUEST,
      5: HttpStatus.NOT_FOUND,
      6: HttpStatus.CONFLICT,
      7: HttpStatus.FORBIDDEN,
      16: HttpStatus.UNAUTHORIZED,
      13: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    const statusCode =
      statusMap[code ?? 13] ?? HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(statusCode).json({
      statusCode,
      message: msg,
      timestamp: new Date().toISOString(),
    });
  }
}
