import { KnexService } from '@/database/knex.service';
import { UtilsService } from '@/common/utils';
import { Injectable } from '@nestjs/common';
import { UpdateAdminDto } from './dtos/update-admin.dto';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { IdParamDto } from '@/common/dtos/id-param.dto';
import { GetAdminDto } from './dtos/get-admin.dto';

@Injectable()
export class AdminsService {
    constructor(
        private readonly utils: UtilsService,
        private readonly knex: KnexService,
    ) { }

    public async listAdmins(): Promise<GetAdminDto[]> {
        const admins = await this.knex
            .conn('admins')
            .select('a.id', 'a.name', 'a.email', 'a.created_at')
            .whereNull('deleted_at')
            .orderBy('created_at');

        return admins;
    }

    public async getAdmin({ id }: IdParamDto): Promise<GetAdminDto> {
        const admin = await this.knex
            .conn('admins' as 'a')
            .select('a.id', 'a.name', 'a.email', 'a.created_at')
            .where('id', id)
            .whereNull('deleted_at')
            .first();

        if (!admin) {
            throw new Error('Admin not found');
        }
        return admin;
    }

    public async createAdmin(data: CreateAdminDto): Promise<IdParamDto> {
        const admin_already_exists = await this.knex
            .conn('admins')
            .where('email', data.email)
            .whereNull('deleted_at')
            .first();

        if (admin_already_exists) {
            throw new Error('Admin already exists');
        }

        const admin: string = await this.knex
            .conn('admins')
            .insert({
                id: this.utils.create_id(),
                name: data.name,
                email: data.email,
                password: this.utils.hash_password(data.password),
            })
            .returning('id');

        return { id: admin };
    }

    public async updateAdmin({ id }: IdParamDto, data: UpdateAdminDto): Promise<IdParamDto> {
        const [admin_exists, email_exists] = await Promise.all([
            this.knex.conn('admins').where('id', id).whereNull('deleted_at').first(),

            this.knex
                .conn('admins')
                .where('email', data.email)
                .whereNull('deleted_at')
                .whereNot('id', id)
                .first(),
        ]);

        if (!admin_exists) {
            throw new Error('Admin not found');
        }

        if (email_exists) {
            throw new Error('Admin already exists');
        }

        const admin: string = await this.knex
            .conn('admins')
            .update({
                name: data.name,
                email: data.email,
                password: this.utils.hash_password(data.password),
                updated_at: new Date(),
            })
            .where('id', id)
            .whereNull('deleted_at')
            .returning('id');

        return { id: admin };
    }

    public async deleteAdmin({ id }: IdParamDto): Promise<IdParamDto> {
        const admin_exists = await this.knex
            .conn('admins')
            .where('id', id)
            .whereNull('deleted_at')
            .first();

        if (!admin_exists) {
            throw new Error('Admin not found');
        }

        const admin: string = await this.knex
            .conn('admins')
            .update({ deleted_at: new Date() })
            .where('id', id)
            .whereNull('deleted_at')
            .returning('id');

        return { id: admin };
    }
}
