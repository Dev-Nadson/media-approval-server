import { Injectable, OnModuleDestroy } from '@nestjs/common';
import knex, { Knex } from 'knex';
import config from '../../knexfile';
import { env } from '@/libs/env.config';

@Injectable()
export class KnexService implements OnModuleDestroy {
    public readonly conn: Knex;

    constructor() {
        this.conn = knex(config[env.NODE_ENV]);
    }

    async onModuleDestroy() {
        await this.conn.destroy();
    }
}
