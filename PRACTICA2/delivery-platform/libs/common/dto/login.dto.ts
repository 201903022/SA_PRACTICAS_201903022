import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/, {
    message:
      'Password must be at least 6 characters long and contain at least one letter and one number.',
  })
  password: string;
}
