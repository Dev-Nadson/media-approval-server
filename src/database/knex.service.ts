import { Injectable, OnModuleDestroy } from '@nestjs/common';
import knex, { Knex } from 'knex';
import config from '../../knexfile';

@Injectable()
export class KnexService implements OnModuleDestroy {
    public readonly conn: Knex;

    constructor() {
        this.conn = knex(config);
    }

    async onModuleDestroy() {
        await this.conn.destroy();
    }
}
