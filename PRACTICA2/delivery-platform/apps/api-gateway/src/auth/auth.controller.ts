import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiGatewayService } from '../api-gateway.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: ApiGatewayService) {}

  @Get('validate1')
  validate(@Query('token') token: string) {
    return this.authService.validate(token ?? '');
  }

  @Post('login1')
  async login(@Body() body: any) {
    // Extraemos email y password del cuerpo de la petición HTTP
    const { email, password } = body;

    // Llamamos al método login de tu ApiGatewayService
    return this.authService.login(email, password);
  }
}
