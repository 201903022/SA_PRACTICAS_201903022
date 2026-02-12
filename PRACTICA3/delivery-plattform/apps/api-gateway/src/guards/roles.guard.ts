import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiGatewayService } from '../api-gateway.service';
import { Roles } from 'libs/common/enums/roles.enum';
import { ValidateTokenResponse } from '../auth/types/auth.types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly apiService: ApiGatewayService,
    private readonly allowedRoles: ReadonlySet<Roles>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers?.authorization;

    if (!auth?.startsWith('Bearer '))
      throw new UnauthorizedException('No token');

    const token = auth.slice('Bearer '.length).trim();

    let res: ValidateTokenResponse;
    try {
      res = (await this.apiService.validate(token)) as ValidateTokenResponse;
    } catch {
      throw new UnauthorizedException('Token invalido');
    }

    if (!res.valid || !res.user)
      throw new UnauthorizedException('Token invalido');

    req.user = res.user;

    if (!this.allowedRoles.has(res.user.role)) {
      throw new ForbiddenException(`No permitido para rol ${res.user.role}`);
    }

    return true;
  }
}
