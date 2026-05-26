import { PaginationMetaDto, PaginationQueryDto } from '@/common/dtos/pagination.dto';

export class ListAdminsQueryDto extends PaginationQueryDto { }

class ListAdminsDto {
    id: string;
    name: string;
    email: string;
    situation: number;
}
export class PaginatedAdminsDto {
    data: ListAdminsDto[];
    meta: PaginationMetaDto;
}