import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiGatewayService } from '../api-gateway.service';
import { LoginDto, RegisterDto } from 'libs/common/dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: ApiGatewayService) {}

  @Get('validate1')
  validate(@Query('token') token: string) {
    return this.authService.validate(token ?? '');
  }

  @Post('login1')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    // * Llamamos al método login la ApiGatewayService
    return this.authService.login(email, password);
  }

  @Post('register1')
  async register(@Body() body: RegisterDto) {
    const payload = {
      name: body.name,
      phone_number: body.phone_number,
      email: body.email,
      password: body.password,
      role: body.role,
    };
    console.log('----------Payload----------');
    console.log(payload);
    return await this.authService.register(payload);
  }
}
