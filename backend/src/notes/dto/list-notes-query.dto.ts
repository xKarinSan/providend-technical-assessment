import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ListNotesQueryDto {
  /** Current page number, zero-based. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page_no: number = 0;

  /** Number of records per page. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  page_size: number = 30;
}
