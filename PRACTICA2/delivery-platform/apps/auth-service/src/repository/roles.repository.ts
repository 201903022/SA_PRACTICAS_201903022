import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
type UpsertRoleWithIdInput = {
  id: string;
  code: string;
  description: string;
  is_system?: boolean;
};


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
  async upsertRoleWithId(input: UpsertRoleWithIdInput) {
    return this.prismaService.roles.upsert({
      where: { id: input.id },
      update: {
        code: input.code,
        description: input.description,
        is_system: input.is_system ?? true,
      },
      create: {
        id: input.id,
        code: input.code,
        description: input.description,
        is_system: input.is_system ?? true,
      },
    });
  }
}
