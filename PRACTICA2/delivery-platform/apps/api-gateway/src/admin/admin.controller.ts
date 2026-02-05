import {
  Body,
  Controller,
  Post,
  Headers,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { RegisterDto } from 'libs/common/dto';
import { ApiGatewayService } from '../api-gateway.service';
// ... otros imports
interface UserPayload {
  id: string;
  email: string;
  role: string;
}
@Controller('admin')
export class AdminController {
  constructor(private readonly authService: ApiGatewayService) {}

  @Post('register/delivery')
  async register(
    @Body() body: RegisterDto,
    @Headers('authorization') authHeader: string, // Extraemos el token del header
  ) {
    console.log('🚀 PETICIÓN RECIBIDA EN API-GATEWAY');
    console.log('Headers:', authHeader);
    console.log('Body:', body);
    // 1. Validar presencia del token
    if (!authHeader) {
      throw new UnauthorizedException('No se proporcionó un token de acceso');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      // 2. Validar el token y obtener el usuario (esto llama a tu microservicio de auth)
      const user: any = await this.authService.validate(token);
      console.log('Usuario validado:', user);

      // 3. Validar que el rol sea ADMIN
      if (user.role !== 'ADMIN') {
        throw new ForbiddenException(
          'No tienes permisos para registrar repartidores',
        );
      }

      // 4. Preparar payload y registrar
      const payload = {
        name: body.name,
        phone_number: body.phone_number,
        email: body.email,
        password: body.password,
        role: 'DELIVERY',
      };

      console.log('---------- Registrando Delivery ----------');
      return await this.authService.register(payload);
    } catch (error) {
      // Manejo de errores de validación o expiración
      throw new UnauthorizedException(
        error.message || 'Token inválido o expirado',
      );
    }
  }
}
