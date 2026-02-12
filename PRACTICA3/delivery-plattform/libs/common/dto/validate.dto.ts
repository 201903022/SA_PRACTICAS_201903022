import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;
}
