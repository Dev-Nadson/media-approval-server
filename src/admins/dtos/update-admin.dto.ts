import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPositive, MinLength, ValidateIf } from 'class-validator';
import { AtLeastOneOf } from '@/common/decorators/at-least-one.validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Roles, Situation } from '@/common/enums/constants';

export class UpdateAdminDto {
  @AtLeastOneOf(['name', 'role', 'situation', 'email', 'password'])
  @ApiPropertyOptional({ example: 'Admin' })
  @IsOptional()
  @MinLength(3)
  name: string;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsEnum(Roles)
  @IsPositive()
  role: Roles;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsEnum(Situation)
  @IsPositive()
  situation: Situation;

  @ApiPropertyOptional({ example: 'admin@admin.com' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '12345678' })
  @IsOptional()
  @MinLength(8)
  password: string;
}
