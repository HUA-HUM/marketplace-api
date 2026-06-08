import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListGoogleProductsQueryDto {
  @ApiPropertyOptional({ example: 25, maximum: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  pageSize?: number;

  @ApiPropertyOptional({ description: 'Token devuelto por nextPageToken en la página anterior' })
  @IsOptional()
  @IsString()
  pageToken?: string;
}
