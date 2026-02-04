import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';

import { LoginDto, RegisterDto } from 'libs/common/dto';
import { AuthServiceService } from './auth-service.service';
import { ValidateDto } from 'libs/common/dto/validate.dto';
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthServiceService) {}
  @GrpcMethod('AuthService', 'Validate')
  Validate(data: ValidateDto) {
    console.log('-------Validate TOken--------');
    try {
      console.log('El token a validar es:', data.access_token);
      const valid = this.authService.validateToken(data.access_token);
      return valid;
    } catch (error) {
      console.error('Error en Validate:', error);
      throw new RpcException({
        code: 13,
        details: 'Error al validar el token',
      });
    }
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
