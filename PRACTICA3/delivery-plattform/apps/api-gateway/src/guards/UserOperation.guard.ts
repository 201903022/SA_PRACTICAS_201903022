import { Injectable } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { ApiGatewayService } from '../api-gateway.service';
import { Roles } from 'libs/common/enums/roles.enum';

@Injectable()
export class UserGuard extends RolesGuard {
  constructor(apiService: ApiGatewayService) {
    super(apiService, new Set<Roles>([Roles.CUSTOMER]));
  }
}
