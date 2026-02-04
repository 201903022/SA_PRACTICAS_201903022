import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findOneByRole(role: string) {
    console.log('Rol a comparar:');
    console.log(role);
    const role2 = await this.prismaService.roles.findUnique({
      where: {
        code: role,
      },
    });
    console.log('role');
    console.log(role2);
    return this.prismaService.roles.findUnique({
      where: {
        code: role,
      },
    });
  }

  async findOneById(id: string) {
    const role = await this.prismaService.roles.findUnique({
      where: { id: id },
    });

    if (!role) {
      throw new Error('Role not found');
    }
    return role;
  }
}
