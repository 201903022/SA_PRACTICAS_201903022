import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UsersRepository } from './repository/users.repository';
import { RolesRepository } from './repository/roles.repository';
import { LoginDto, RegisterDto } from 'libs/common/dto';
import { BcryptService } from './bycrypt/bycrypt.service';
import { status } from '@grpc/grpc-js';
import { AuthResponse } from './entities/responses';

@Injectable()
export class AuthServiceService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly rolesRepo: RolesRepository,
    private readonly encrcyptService: BcryptService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async loginUser(data: LoginDto) {
    const { email, password } = data;
    const user = await this.usersRepo.findByEmail(email);
    if (!user) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'User not found',
      });
    }

    const isPasswordValid = await this.encrcyptService.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'Invalid credentials',
      });
    }
    const role = await this.rolesRepo.findOneById(user.role_id);
    return new AuthResponse('access-demo', 'refresh-demo', {
      id: user.id,
      email: user.email,
      role: role.code,
      name: user.name,
    });
  }

  async registerUser(data: RegisterDto) {
    const existingEmail = await this.usersRepo.findByEmail(data.email);

    if (existingEmail) {
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: 'Email already in use',
      });
    }

    const userRole = await this.rolesRepo.findOneByRole(data.role);
    if (!userRole) throw new Error('Default user role not found');

    const hashedPassword = await this.encrcyptService.hash(data.password);

    const newUser = await this.usersRepo.create({
      ...data,
      passwordHash: hashedPassword,
      roleId: userRole.id,
      phone_Number: data.phone_number,
    });
    return {
      access_token: 'access-demo',
      refresh_token: 'refresh-demo',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: data.role,
        name: newUser.name,
      },
    };
  }
}
