import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
  UnauthorizedException,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ApiGatewayService } from '../api-gateway.service';
import { LoginDto, RegisterDto } from 'libs/common/dto';
import { AtLeastAdminGuard } from '../guards/AtLeastAdmin.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: ApiGatewayService) {}

  @Get('validate1')
  validate(@Query('token') access_token: string) {
    console.log('Funcion validar token');
    console.log('Token');
    console.log(access_token);
    return this.authService.validate(access_token ?? '');
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    // * Llamamos al método login la ApiGatewayService
    return this.authService.login(email, password);
  }

  @Post('register')
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

  @UseGuards(AtLeastAdminGuard)
  @Post('admin/register/delivery')
  async registerDelivery(@Body() body: RegisterDto) {
    try {
      const payload = { ...body, role: 'DRIVER' };

      const result = await this.authService.register(payload);

      return result;
    } catch (error) {
      console.error('Error al registrar en el microservicio:', error);
      throw error;
    }
  }
  @UseGuards(AtLeastAdminGuard)
  @Post('admin/register/merchant') // Ruta específica para empresas
  async registerMerchant(@Body() body: RegisterDto) {
    console.log('Registrando nueva EMPRESA (MERCHANT)...');

    // Mismo proceso: forzamos el rol del Enum que me pasaste
    return await this.authService.register({
      ...body,
      role: 'MERCHANT',
    });
  }
}
