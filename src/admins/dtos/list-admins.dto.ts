import { PaginationMetaDto, PaginationQueryDto } from '@/common/dtos/pagination.dto';
import { GetAdminDto } from './get-admin.dto';

export class ListAdminsDto extends PaginationQueryDto { }

export class PaginatedAdminsDto {
    data: GetAdminDto[];
    meta: PaginationMetaDto;
}