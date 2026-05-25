import { IsEmail, IsNotEmpty, MinLength, Length } from 'class-validator';

export class GetAdminDto {
  @IsNotEmpty()
  @Length(24, 24)
  id: string;

  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  created_at: string;
}
