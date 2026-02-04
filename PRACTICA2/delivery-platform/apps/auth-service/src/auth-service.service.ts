import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UsersRepository } from './repository/users.repository';
import { RolesRepository } from './repository/roles.repository';
import { LoginDto, RegisterDto } from 'libs/common/dto';
import { BcryptService } from './bycrypt/bycrypt.service';
import { status } from '@grpc/grpc-js';
import {
  AuthResponse,
  UserResponse,
  ValidateResponse,
} from './entities/responses';
import { JwtService } from '@nestjs/jwt';
import { JwtDto } from 'libs/common/dto/jwt.dto';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayload } from './interfaces/acces-token.payload';

@Injectable()
export class AuthServiceService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly rolesRepo: RolesRepository,
    private readonly encrcyptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async generatToke(data: JwtDto) {
    const roleCode = await this.rolesRepo.findOneById(data.role);
    const payload = {
      sub: data.user_id,
      email: data.email,
      role: roleCode.code,
    };

    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'default_secret';
    const refreshTTL =
      this.configService.get<string>('JWT_REFRESH_TTL') ?? '7d';
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: refreshTTL as never,
    });
    // ! Debo retornar valid && user
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateToken(token: string) {
    try {
      const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
      const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(
        token,
        {
          secret,
        },
      );
      const user = await this.usersRepo.findOneById(payload.sub);
      if (!user) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'User not found',
        });
      }
      const userResponse = new UserResponse({
        id: user.id,
        name: user.name,
        role: payload.role,
        email: payload.email,
      });
      return new ValidateResponse(true, userResponse);
    } catch (error) {
      console.log('Error en validate Token');
      console.log(error);
      throw new RpcException({
        code: 16, // Unauthenticated
        message: 'Invalid or expired token',
      });
    }
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

    const { accessToken, refreshToken } = await this.generatToke({
      user_id: user.id,
      email: user.email,
      role: user.role_id,
    });

    const role = await this.rolesRepo.findOneById(user.role_id);
    return new AuthResponse(accessToken, refreshToken, {
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
