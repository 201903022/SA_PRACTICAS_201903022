import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AuthGrpcService, RegisterRequest } from './types';

@Injectable()
export class ApiGatewayService implements OnModuleInit {
  private auth!: AuthGrpcService;

  constructor(@Inject('AUTH_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.auth = this.client.getService<AuthGrpcService>('AuthService');
  }

  async validate(access_token: string) {
    console.log('LAALDJLKDJMLKM');
    return lastValueFrom(this.auth.Validate({ access_token }));
  }

  async login(email: string, password: string) {
    return lastValueFrom(this.auth.Login({ email, password }));
  }

  async register(data: RegisterRequest) {
    return await lastValueFrom(this.auth.Register(data));
  }
}
