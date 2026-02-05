import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiGatewayService } from '../api-gateway.service';
// ... imports previos

@Injectable()
export class AtLeastAdminGuard implements CanActivate {
  constructor(private readonly apiService: ApiGatewayService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No se proporcionó el token');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const response: any = await this.apiService.validate(token);

      console.log('--- Debug Guard ---');
      console.log('Respuesta completa:', response);

      // Verificamos la estructura según tu log: response.user.role
      if (!response.valid || !response.user || response.user.role !== 'ADMIN') {
        console.log('Acceso denegado para el rol:', response?.user?.role);
        throw new ForbiddenException('No tienes permisos de Administrador');
      }

      // Seteamos el usuario en la request por si lo ocupas en el controller
      request.user = response.user;

      return true;
    } catch (e) {
      // Si ya es una ForbiddenException, la dejamos pasar para que no se convierta en 401
      if (e instanceof ForbiddenException) throw e;

      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
