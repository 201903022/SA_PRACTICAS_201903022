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
import { Roles } from 'libs/common/enums/roles.enum';

@Injectable()
export class AuthServiceService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly rolesRepo: RolesRepository,
    private readonly encrcyptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
    await this.seedAdmin();
  }
  getHello(): string {
    return 'Hello World!';
  }

  async generatToke(data: JwtDto) {
    const roleCode = await this.rolesRepo.findOneById(data.role);
    const payload = {
      sub: data.user_id,
      name: data.name,
      email: data.email,
      role: roleCode.code,
    };

    // Obtenemos secretos y tiempos del .env
    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const accessTTL = this.configService.get<string>('JWT_ACCESS_TTL') ?? '2h'; // <-- 2 Horas

    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'default_secret';
    const refreshTTL =
      this.configService.get<string>('JWT_REFRESH_TTL') ?? '7d';

    // Firmamos el Access Token con tiempo explícito
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: accessSecret,
      expiresIn: accessTTL as any, // Asegura que dure lo suficiente
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: refreshTTL as any,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateToken(token: string) {
    try {
      console.log('Validar TOken Auth-Service');
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
      name: user.name,
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
    console.log('Registrar Usuario');
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

  private async seedAdmin() {
    try {
      const adminEmail =
        this.configService.get<string>('ADMIN_EMAIL') ?? 'email';
      const adminPassword =
        this.configService.get<string>('ADMIN_PASSWORD') ?? 'password';
      const adminName = this.configService.get<string>('ADMIN_NAME') ?? 'Admin';

      const existingAdmin = await this.usersRepo.findByEmail(adminEmail);
      if (existingAdmin) {
        return; // El admin ya existe, no hacer nada
      }
      const adminRole = await this.rolesRepo.findOneByRole(Roles.ADMIN);
      if (!adminRole) {
        throw new Error('Admin role not found');
      }
      const hashedPassword = await this.encrcyptService.hash(adminPassword);
      console.log('Datos de admin a guardar');
      console.log({ adminEmail, adminName, adminRole: adminRole.code });
      await this.usersRepo.create({
        name: adminName,
        email: adminEmail,
        passwordHash: hashedPassword,
        roleId: adminRole.id,
        phone_Number: '0000000000',
      });
    } catch (error) {
      console.error('Error seeding admin user:', error);
    }
  }
  private async seedRoles() {
    const roles = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        code: 'CUSTOMER',
        description: 'End user who places orders',
        is_system: true,
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        code: 'MERCHANT',
        description: 'Restaurant/store owner or operator',
        is_system: true,
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        code: 'DRIVER',
        description: 'Delivery driver',
        is_system: true,
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        code: 'ADMIN',
        description: 'Platform administrator',
        is_system: true,
      },
    ];

    for (const r of roles) {
      await this.rolesRepo.upsertRoleWithId(r);
    }
  }
}
