import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BcryptService } from './bycrypt/bycrypt.service';

@Controller()
export class AuthController {
  constructor(private readonly bycryptService: BcryptService) {}
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

  @GrpcMethod('AuthService', 'Register')
  async Register(data: {
    name: string;
    phone_number: string;
    email: string;
    password: string;
    role: string;
  }) {
    /*
      
message AuthResponse {
  string access_token = 1;
  string refresh_token = 2;
  User user = 3;
}
  message User {
  string id = 1;
  string email = 2;
  string role = 3;
  string name = 4;
}
    */
    //clg password_hash
    const password_hash = await this.bycryptService.hash(data.password);
    console.log(`The password hash is `);
    console.log({ password_hash });
    console.log(`Registering user with email: ${data.email}`);
    return {
      access_token: 'access_token_example',
      refresh_token: 'refresh_token_example',
      user: {
        id: 'user-123',
        email: data.email,
        role: data.role,
        name: data.name,
      },
    };
  }
}
