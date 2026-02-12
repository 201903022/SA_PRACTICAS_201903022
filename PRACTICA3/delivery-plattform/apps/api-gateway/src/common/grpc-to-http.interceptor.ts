import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class GrpcToHttpInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        // ✅ Si es HTTP (ValidationPipe, BadRequest, Unauthorized...) NO lo conviertas
        if (err instanceof HttpException) {
          return throwError(() => err);
        }

        // ✅ Si ya es RpcException (viene de gRPC) dejalo pasar para que lo maneje HyperRpcExceptionFilter
        if (err instanceof RpcException) {
          return throwError(() => err);
        }

        // Fallback: errores raros
        return throwError(
          () =>
            new RpcException({
              code: 13,
              message: err?.message ?? 'Internal error',
            }),
        );
      }),
    );
  }
}
