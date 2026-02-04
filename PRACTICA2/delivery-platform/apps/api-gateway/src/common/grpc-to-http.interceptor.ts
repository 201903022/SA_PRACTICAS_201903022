// apps/api-gateway/src/common/interceptors/grpc-to-http.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RpcException } from '@nestjs/microservices';
import { GrpcError } from '../interfaces';

@Injectable()
export class GrpcToHttpInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: unknown) => {
        let code = 13;
        let message = 'Internal Server Error';

        if (err && typeof err === 'object') {
          const grpcErr = err as GrpcError;
          code = grpcErr.code ?? 13;
          message = grpcErr.details ?? grpcErr.message ?? message;
        }

        return throwError(() => new RpcException({ code, message }));
      }),
    );
  }
}
