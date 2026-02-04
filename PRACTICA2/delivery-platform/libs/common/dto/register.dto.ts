import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer'; // <--- Importar esto
import { Roles } from '../enums/roles.enum';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/, {
    message:
      'Password must be at least 6 characters long and contain at least one letter and one number.',
  })
  password: string;

  @Transform(({ value }: TransformFnParams): string => {
    return typeof value === 'string'
      ? value.trim().toUpperCase()
      : (value as string);
  })
  @IsEnum(Roles, {
    message: `Ivalide role value.  `,
  })
  @IsNotEmpty()
  role: Roles = Roles.CUSTOMER;
}
