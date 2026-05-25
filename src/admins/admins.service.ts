import { KnexService } from '@/database/knex.service';
import { UtilsService } from '@/libs/utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminsService {
    constructor(
        private readonly utils: UtilsService,
        private readonly knex: KnexService
    ) { }

    public async listAdmins(): Promise<any[]> {
        const admins = await this.knex.conn('admins')
            .select('*')
            .whereNull('deleted_at')
            .orderBy('created_at');
        return admins;
    }

    public async getAdmin(id: string): Promise<any | null> {
        const admin = await this.knex.conn('admins')
            .where('id', id)
            .whereNull('deleted_at')
            .first()
        return admin
    }

    public async createAdmin(data: any): Promise<any> {
        const user_already_exists = await this.knex.conn('admins')
            .where('email', data.email)
            .whereNull('deleted_at')
            .first();

        if (user_already_exists) {
            throw new Error('User already exists');
        }

        const admin = await this.knex.conn('admins')
            .insert({
                id: this.utils.create_id(),
                name: data.name,
                email: data.email,
                password: this.utils.hash_password(data.password),
            }).returning('id');
        return admin;
    }

    public async updateAdmin(id: string, data: any): Promise<any> {
        const [admin_exists, email_exists] = await Promise.all([
            this.knex.conn('admins')
                .where('id', id)
                .whereNull('deleted_at')
                .first(),

            this.knex.conn('admins')
                .where('email', data.email)
                .whereNull('deleted_at')
                .whereNot('id', id)
                .first(),
        ]);

        if (!admin_exists) {
            throw new Error('User not found');
        }

        if (email_exists) {
            throw new Error('User already exists');
        }

        const admin = await this.knex.conn('admins')
            .update({
                name: data.name,
                email: data.email,
                password: this.utils.hash_password(data.password),
                updated_at: new Date(),
            })
            .where('id', id)
            .whereNull('deleted_at')
            .returning('id');
        return admin;
    }

    public async deleteAdmin(id: string): Promise<any> {
        const admin_exists = await this.knex.conn('admins')
            .where('id', id)
            .whereNull('deleted_at')
            .first()

        if (!admin_exists) {
            throw new Error('User not found');
        }

        const admin = await this.knex.conn('admins')
            .update({
                deleted_at: new Date(),
            })
            .where('id', id)
            .whereNull('deleted_at')
            .returning('id');
        return admin;
    }
}
