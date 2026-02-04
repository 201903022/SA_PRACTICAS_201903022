import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
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

  async register(data: {
    name: string;
    phone_number?: string;
    email: string;
    password: string;
    role: string;
  }) {
    const payload: RegisterRequest = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    };

    if (data.phone_number) {
      payload.phone_number = data.phone_number;
    }

    return lastValueFrom(this.auth.Register(payload));
  }
}
