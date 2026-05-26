import 'reflect-metadata';
import 'dotenv/config';
import { plainToInstance, Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  Max,
  Min,
  IsInt,
  IsString,
  validateSync,
} from 'class-validator';

class EnvSchema {
  @IsIn(['development', 'production', 'test'])
  NODE_ENV!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1024)
  @Max(65535)
  PORT!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  BCRYPT_ROUNDS!: number;

  @IsNotEmpty()
  @IsString()
  JWT_SECRET!: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_URL!: string;

  @IsNotEmpty()
  @IsString()
  TEST_DATABASE_URL!: string;
}

function parseEnv() {
  const parsed = plainToInstance(EnvSchema, process.env, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(parsed, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(`Invalid Env:\n${errors.toString()}`);
  }

  return parsed;
}

export const env = parseEnv();
