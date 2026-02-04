// apps/api-gateway/src/common/filters/rpc-exception.filter.ts
import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  ExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class HyperRpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const error: any = exception.getError();

    const statusMap = {
      3: HttpStatus.BAD_REQUEST,
      5: HttpStatus.NOT_FOUND,
      6: HttpStatus.CONFLICT, // Ya existe
      16: HttpStatus.UNAUTHORIZED,
    };

    const statusCode =
      statusMap[error.code] || HttpStatus.INTERNAL_SERVER_ERROR;

    // Aquí está el truco: usamos error.message porque es lo que enviamos en el throw
    response.status(statusCode).json({
      statusCode: statusCode,
      message: error.message || 'An error occurred',
      error:
        statusCode === 500 ? 'Internal Server Error' : 'Microservice Error',
    });
  }
}
