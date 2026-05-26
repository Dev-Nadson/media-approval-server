import { KnexService } from '@/database/knex.service';
import { UtilsService } from '@/common/utils';
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateAdminDto } from './dtos/update-admin.dto';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { IdParamDto } from '@/common/dtos/id-param.dto';
import { GetAdminDto } from './dtos/get-admin.dto';
import { ListAdminsDto, PaginatedAdminsDto } from './dtos/list-admins.dto';

@Injectable()
export class AdminsService {
    constructor(
        private readonly utils: UtilsService,
        private readonly knex: KnexService,
    ) { }

    public async listAdmins({ limit = 10, page = 1 }: ListAdminsDto): Promise<PaginatedAdminsDto> {
        const offset = (page - 1) * limit;

        const [admins, count_result] = await Promise.all([
            this.knex
                .conn('admins as a')
                .select('a.id', 'a.name', 'a.email')
                .whereNull('deleted_at')
                .orderBy('created_at')
                .limit(limit)
                .offset(offset),
            this.knex
                .conn('admins as a')
                .whereNull('a.deleted_at')
                .count('a.id as count')
                .first()
        ]);

        const total = Number(count_result?.count ?? 0);
        const last_page = Math.ceil(total / limit);

        return {
            data: admins,
            meta: {
                total,
                page,
                limit,
                last_page,
            },
        };
    }

    public async getAdmin({ id }: IdParamDto): Promise<GetAdminDto> {
        const admin = await this.knex
            .conn('admins as a')
            .select('a.id', 'a.name', 'a.email', 'a.created_at')
            .where('id', id)
            .whereNull('deleted_at')
            .first();

        if (!admin) {
            throw new NotFoundException('Admin not found');
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
            throw new ConflictException('Admin already exists');
        }

        const [inserted] = await this.knex
            .conn('admins')
            .insert({
                id: this.utils.create_id(),
                name: data.name,
                email: data.email,
                password: this.utils.hash_password(data.password),
            })
            .returning('id');

        return { id: inserted.id };
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
            throw new NotFoundException('Admin not found');
        }

        if (email_exists) {
            throw new ConflictException('Admin already exists');
        }

        const [updated] = await this.knex
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

        return { id: updated.id };
    }

    public async deleteAdmin({ id }: IdParamDto): Promise<IdParamDto> {
        const admin_exists = await this.knex
            .conn('admins')
            .where('id', id)
            .whereNull('deleted_at')
            .first();

        if (!admin_exists) {
            throw new NotFoundException('Admin not found');
        }

        const [deleted] = await this.knex
            .conn('admins')
            .update({ deleted_at: new Date() })
            .where('id', id)
            .whereNull('deleted_at')
            .returning('id');

        return { id: deleted.id };
    }
}
