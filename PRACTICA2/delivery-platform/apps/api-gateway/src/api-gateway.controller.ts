import { Controller, Get, Query } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';

@Controller()
export class ApiGatewayController {
  constructor(private readonly svc: ApiGatewayService) {}

  @Get('auth/validate')
  validate(@Query('token') token: string) {
    return this.svc.validate(token ?? '');
  }
}
