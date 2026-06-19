import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GoogleProductIdentityQueryDto {
  @ApiPropertyOptional({ example: 'es' })
  @IsOptional()
  @IsString()
  contentLanguage?: string;

  @ApiPropertyOptional({ example: 'AR' })
  @IsOptional()
  @IsString()
  feedLabel?: string;
}
