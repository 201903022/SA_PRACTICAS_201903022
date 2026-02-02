import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AuthServiceController {
  @GrpcMethod('AuthService', 'ValidateToken')
  validateToken(data: { token: string }) {
    // DEMO: valida si el token no esta vacio
    const valid = !!data?.token && data.token.length > 10;

    return {
      valid,
      userId: valid ? 'user-123' : '',
      role: valid ? 'CUSTOMER' : '',
    };
  }
}
