import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsISO8601, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetFravegaOrdersQueryDto {
  @ApiPropertyOptional({ description: 'Filtra por sellerSku. Ej: 782200' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sku?: number;

  @ApiPropertyOptional({ description: 'Filtra por numero de documento del cliente. Ej: 30123456' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  docnumber?: number;

  @ApiPropertyOptional({ description: 'Filtra por nombre del cliente. Ej: Juan Perez' })
  @IsOptional()
  @IsString()
  clientname?: string;

  @ApiPropertyOptional({ description: 'Fecha de compra desde (ISO8601). Ej: 2024-12-16T11:48:00.000Z' })
  @IsOptional()
  @IsISO8601()
  purchasedatefrom?: string;

  @ApiPropertyOptional({ description: 'Fecha de compra hasta (ISO8601). Ej: 2024-12-16T11:48:00.000Z' })
  @IsOptional()
  @IsISO8601()
  purchasedateto?: string;

  @ApiPropertyOptional({ description: 'Fecha de facturacion desde (ISO8601). Ej: 2024-12-16T11:48:00.000Z' })
  @IsOptional()
  @IsISO8601()
  invoicementdatefrom?: string;

  @ApiPropertyOptional({ description: 'Fecha de facturacion hasta (ISO8601). Ej: 2024-12-16T11:48:00.000Z' })
  @IsOptional()
  @IsISO8601()
  invoicementdateto?: string;

  @ApiPropertyOptional({ enum: ['SP', 'HD'] })
  @IsOptional()
  @IsIn(['SP', 'HD'])
  deliverytype?: string;

  @ApiPropertyOptional({ enum: ['pending', 'invoiced', 'canceled', 'delivered'] })
  @IsOptional()
  @IsIn(['pending', 'invoiced', 'canceled', 'delivered'])
  status?: string;

  @ApiPropertyOptional({ description: 'Filtra por estado de facturacion. Ej: pending' })
  @IsOptional()
  @IsString()
  invoiceStatus?: string;

  @ApiPropertyOptional({ type: Number, example: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ name: 'page-size', type: Number, example: 100, default: 100, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  ['page-size'] = 100;
}
