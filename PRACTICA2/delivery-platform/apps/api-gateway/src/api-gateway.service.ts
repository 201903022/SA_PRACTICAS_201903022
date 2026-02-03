import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices'; // <-- IMPORT TYPE
import { lastValueFrom } from 'rxjs';

type AuthGrpcService = {
  Validate(data: { access_token: string }): any; // coincide con proto
  Login(data: { email: string; password: string }): any;
};

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
}
