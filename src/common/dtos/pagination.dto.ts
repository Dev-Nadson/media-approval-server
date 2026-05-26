import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationQueryDto {
    @ApiPropertyOptional({ example: 10, description: 'should be a number' })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiPropertyOptional({ example: 1, description: 'should be a number' })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;
}

export class PaginationMetaDto {
    total: number;
    page: number;
    limit: number;
    last_page: number;
}