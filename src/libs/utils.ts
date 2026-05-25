import { Injectable } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { hash, compare } from 'bcryptjs';
import { env } from './env.config';

@Injectable()
export class UtilsService {
  public create_id(): string {
    return createId();
  }
  public async hash_password(password: string): Promise<string> {
    return hash(password, env.BCRYPT_ROUNDS);
  }
  public async compare_password(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return compare(password, hash);
  }
}
