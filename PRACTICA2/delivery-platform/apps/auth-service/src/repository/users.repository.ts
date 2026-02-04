import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type UserToSave = {
  email: string;
  name: string;
  passwordHash: string; // importante: hash, no plain
  roleId: string; // UUID como string
  phone_Number?: string | null;
};
@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string) {
    return await this.prismaService.users.findUnique({ where: { email } });
  }

  async create(data: UserToSave) {
    return await this.prismaService.users.create({
      data: {
        email: data.email,
        password: data.passwordHash,
        name: data.name,
        phone_number: data.phone_Number ?? null,
        role_id: data.roleId,
        // is_active, email_verified, created_at, updated_at los maneja la DB
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone_number: true,
        role_id: true,
        is_active: true,
        email_verified: true,
        created_at: true,
        updated_at: true,
      },
    });
  }
}
