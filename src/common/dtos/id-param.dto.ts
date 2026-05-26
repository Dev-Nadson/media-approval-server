import { IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IdParamDto {
  @ApiProperty({
    example: 'xr3pve7zk5s423lfoj0j4ksj',
    description: 'should be a CUID2',
  })
  @IsNotEmpty()
  @Length(24, 24)
  id: string;
}
