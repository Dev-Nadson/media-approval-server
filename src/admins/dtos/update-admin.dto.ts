import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateAdminDto {
  @IsOptional()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @MinLength(8)
  password: string;
}
