import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';

import { UserResponse, ValidateResponse } from './entities/responses';
import { ValidateRequest } from './entities/requests';
import { LoginDto, RegisterDto } from 'libs/common/dto';
import { AuthServiceService } from './auth-service.service';
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthServiceService) {}
  @GrpcMethod('AuthService', 'Validate')
  Validate(data: ValidateRequest) {
    const valid = !!data?.access_token && data.access_token.length > 10;
    const userResponseValid = valid
      ? new UserResponse({
          id: 'user-123',
          email: 'demo@example.com',
          role: 'CUSTOMER',
          name: 'Demo',
        })
      : new UserResponse({ id: '', email: '', role: 'GUEST', name: 'Guest' });
    return new ValidateResponse(valid, userResponseValid);
  }

  @GrpcMethod('AuthService', 'GetPublicKey')
  GetPublicKey() {
    return {
      public_key:
        '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQ...\n-----END PUBLIC KEY-----',
    };
  }

  @GrpcMethod('AuthService', 'Login')
  async Login(data: LoginDto) {
    try {
      console.log('Logiiiiiiiiin');
      return this.authService.loginUser(data);
    } catch (error) {
      console.error('Error en Login:', error);
      throw new RpcException({
        code: 13,
        details: 'Error al procesar el login del usuario',
      });
    }
  }

  @GrpcMethod('AuthService', 'Register')
  async Register(data: RegisterDto) {
    console.log(JSON.stringify(data));
    try {
      console.log('--- PETICIÓN RECIBIDA EN AUTH ---');
      console.log('Data:', data);
      console.log('LLEGÓ AL CONTROLADOR DE AUTH:', data);
      return this.authService.registerUser(data);
    } catch (error) {
      console.error('Error en Register:', error);
      throw new RpcException({
        code: 13,
        details: 'Error al procesar el registro del usuario',
      });
    }
  }
}
