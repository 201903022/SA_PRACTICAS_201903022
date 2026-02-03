import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AuthController {
  @GrpcMethod('AuthService', 'Validate')
  Validate(data: { access_token: string }) {
    const valid = !!data?.access_token && data.access_token.length > 10;

    return {
      valid,
      user: valid
        ? {
            id: 'user-123',
            email: 'demo@example.com',
            role: 'CUSTOMER',
            name: 'Demo',
          }
        : { id: '', email: '', role: '', name: '' },
    };
  }

  @GrpcMethod('AuthService', 'GetPublicKey')
  GetPublicKey() {
    return {
      public_key:
        '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQ...\n-----END PUBLIC KEY-----',
    };
  }

  @GrpcMethod('AuthService', 'Login')
  Login(data: { email: string; password: string }) {
    console.log(`The password is ${data.password}`);
    return {
      token: 'tokeng',
      email: data.email,
      role: 'CUSTOMER',
    };
  }
  // Dummy implementation for demonstration
}
