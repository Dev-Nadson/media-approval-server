import { KnexService } from '@/database/knex.service';
import { UtilsService } from '@/common/utils';
import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { UpdateAdminDto } from './dtos/update-admin.dto';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { IdParamDto } from '@/common/dtos/id-param.dto';
import { GetAdminDto } from './dtos/get-admin.dto';
import { ListAdminsQueryDto, PaginatedAdminsDto } from './dtos/list-admins.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { CACHE_KEYS, CACHE_TTL } from '@/common/constants/cache-constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AdminsService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly eventEmitter: EventEmitter2,
        private readonly utils: UtilsService,
        private readonly knex: KnexService,
    ) { }

    public async listAdmins({ limit = 10, page = 1 }: ListAdminsQueryDto): Promise<PaginatedAdminsDto> {
        const cacheKey = CACHE_KEYS.ADMINS_LIST(page, limit);

        const cached = await this.cacheManager.get<PaginatedAdminsDto>(cacheKey);
        if (cached) { return cached; }

        const offset = (page - 1) * limit;

        const [admins, count_result] = await Promise.all([
            this.knex
                .conn('admins as a')
                .select('a.id', 'a.name', 'a.email', 'a.situation')
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

        const result: PaginatedAdminsDto = {
            data: admins,
            meta: {
                total,
                page,
                limit,
                last_page,
            },
        };

        await this.cacheManager.set(cacheKey, result, CACHE_TTL.FIVE_MINUTES);
        return result;
    }

    public async getAdmin({ id }: IdParamDto): Promise<GetAdminDto> {
        const cacheKey = CACHE_KEYS.ADMIN_GET(id);

        const cached = await this.cacheManager.get<GetAdminDto>(cacheKey);
        if (cached) return cached;

        const admin = await this.knex
            .conn('admins as a')
            .select('a.id', 'a.name', 'a.email', 'a.role', 'a.situation', 'a.created_at')
            .where('id', id)
            .whereNull('deleted_at')
            .first();

        if (!admin) { throw new NotFoundException('Admin not found'); }

        await this.cacheManager.set(cacheKey, admin, CACHE_TTL.FIVE_MINUTES);
        return admin;
    }

    public async createAdmin(data: CreateAdminDto): Promise<IdParamDto> {
        const admin_already_exists = await this.knex
            .conn('admins')
            .where('email', data.email)
            .whereNull('deleted_at')
            .first();

        if (admin_already_exists) { throw new ConflictException('Admin already exists'); }

        const [inserted] = await this.knex
            .conn('admins')
            .insert({
                id: this.utils.create_id(),
                name: data.name,
                role: data.role,
                situation: data.situation,
                email: data.email,
                password: this.utils.hash_password(data.password),
            })
            .returning('id');

        await this.eventEmitter.emitAsync('admins.mutated', { id: inserted.id });
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

        if (!admin_exists) { throw new NotFoundException('Admin not found'); }
        if (email_exists) { throw new ConflictException('Admin already exists'); }

        const [updated] = await this.knex
            .conn('admins')
            .update({
                name: data.name,
                role: data.role,
                situation: data.situation,
                email: data.email,
                password: this.utils.hash_password(data.password),
                updated_at: new Date(),
            })
            .where('id', id)
            .whereNull('deleted_at')
            .returning('id');

        await this.eventEmitter.emitAsync('admins.mutated', { id });
        return { id: updated.id };
    }

    public async deleteAdmin({ id }: IdParamDto): Promise<IdParamDto> {
        const [deleted] = await this.knex
            .conn('admins')
            .update({ deleted_at: new Date() })
            .where('id', id)
            .whereNull('deleted_at')
            .returning('id');

        if (!deleted) {
            throw new NotFoundException('Admin not found');
        }

        await this.eventEmitter.emitAsync('admins.mutated', { id });
        return { id: deleted.id };
    }
}
