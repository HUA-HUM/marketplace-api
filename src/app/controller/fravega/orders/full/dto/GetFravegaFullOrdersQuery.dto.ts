import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
import { GetFravegaOrdersQueryDto } from 'src/app/controller/fravega/orders/dto/GetFravegaOrdersQuery.dto';

export class GetFravegaFullOrdersQueryDto extends GetFravegaOrdersQueryDto {
  // Cada orden suma 2 llamadas (detalle Seller Central + VTEX): se limita el tamaño de pagina
  @ApiPropertyOptional({ name: 'page-size', type: Number, example: 20, default: 20, maximum: 50 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  ['page-size'] = 20;

  @ApiPropertyOptional({
    type: Boolean,
    default: false,
    description: 'Incluye en cada orden los payloads originales de Seller Central y VTEX (respuesta mucho mas pesada)'
  })
  @IsOptional()
  // @Type(() => Boolean) convertiria "false" en true
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
  @IsBoolean()
  includeRaw?: boolean;
}
