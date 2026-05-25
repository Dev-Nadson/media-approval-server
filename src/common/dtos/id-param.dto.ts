import { IsNotEmpty, Length } from 'class-validator';

export class IdParamDto {
  @IsNotEmpty()
  @Length(24, 24)
  id: string;
}
