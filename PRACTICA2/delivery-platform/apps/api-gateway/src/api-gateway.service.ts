import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { RpcException, type ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AuthGrpcService, RegisterRequest } from './types';

@Injectable()
export class ApiGatewayService implements OnModuleInit {
  private auth!: AuthGrpcService;

  constructor(@Inject('AUTH_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.auth = this.client.getService<AuthGrpcService>('AuthService');
  }

  async validate(accessToken: string) {
    return lastValueFrom(this.auth.Validate({ access_token: accessToken }));
  }

  async login(email: string, password: string) {
    return lastValueFrom(this.auth.Login({ email, password }));
  }

  async register(data: RegisterRequest) {
    try {
      return await lastValueFrom(this.auth.Register(data));
    } catch (error) {
      // error suele venir como: { code: 6, details: "Email already in use", ... }
      throw new RpcException({
        code: error.code || 13,
        message: error.details || error.message || 'Internal Server Error',
      });
    }
  }
}
