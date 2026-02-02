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
}
