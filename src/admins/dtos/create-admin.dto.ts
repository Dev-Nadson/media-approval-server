import { IsEmail, IsEnum, IsNotEmpty, IsPositive, Length, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Roles, Situation } from '@/common/enums';
import { Type } from 'class-transformer';

export class CreateAdminDto {
  @ApiProperty({ example: 'Admin' })
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsEnum(Roles)
  @IsPositive()
  role: Roles;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsEnum(Situation)
  @IsPositive()
  situation: Situation;

  @ApiProperty({ example: 'admin@admin.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
