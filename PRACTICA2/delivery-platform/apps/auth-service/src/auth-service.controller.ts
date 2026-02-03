import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { BcryptService } from './bycrypt/bycrypt.service';

import {
  AuthResponse,
  UserResponse,
  ValidateResponse,
} from './entities/responses';
import { ValidateRequest } from './entities/requests';
import { LoginDto, RegisterDto } from 'libs/common/dto';
@Controller()
export class AuthController {
  constructor(private readonly bycryptService: BcryptService) {}
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
  Login(data: LoginDto) {
    console.log(`The password is ${data.password}`);
    return new AuthResponse('access_token_example', 'refresh_token_example', {
      id: 'user-123',
      email: data.email,
      name: 'Demo User',
      role: 'CUSTOMER',
    });
  }

  @GrpcMethod('AuthService', 'Register')
  async Register(data: RegisterDto) {
    console.log('HOlaaaaaaaaa');
    console.log(JSON.stringify(data));
    try {
      console.log('--- PETICIÓN RECIBIDA EN AUTH ---');
      console.log('Data:', data);
      console.log('LLEGÓ AL CONTROLADOR DE AUTH:', data);
      const password_hash = await this.bycryptService.hash(data.password);

      // Log para depurar
      console.log(`Hashed: ${password_hash}`);

      return new AuthResponse('access_token_example', 'refresh_token_example', {
        id: 'user-123',
        email: data.email,
        name: data.name,
        role: data.role,
      });
    } catch (error) {
      console.error('Error en Register:', error);
      // IMPORTANTE: Lanza una RpcException para que el Gateway reciba un error claro
      throw new RpcException({
        code: 13, // Internal
        details: 'Error al procesar el registro del usuario',
      });
    }
  }
}
