import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateFravegaPriceDto {
  @ApiProperty({
    description: 'Precio de lista',
    example: 1000
  })
  @IsInt()
  list: number;

  @ApiProperty({
    description: 'Precio de venta',
    example: 900
  })
  @IsInt()
  sale: number;

  @ApiPropertyOptional({
    description: 'Precio sin impuestos',
    example: 744
  })
  @IsOptional()
  @IsInt()
  net?: number;
}
