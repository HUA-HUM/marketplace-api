import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsISO8601, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetFravegaOrdersQueryDto {
  @ApiPropertyOptional({ example: 782200, description: 'Filtra por sellerSku' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sku?: number;

  @ApiPropertyOptional({ example: 30123456, description: 'Filtra por numero de documento del cliente' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  docnumber?: number;

  @ApiPropertyOptional({ example: 'Juan Perez', description: 'Filtra por nombre del cliente' })
  @IsOptional()
  @IsString()
  clientname?: string;

  @ApiPropertyOptional({ example: '2024-12-16T11:48:00.000Z' })
  @IsOptional()
  @IsISO8601()
  purchasedatefrom?: string;

  @ApiPropertyOptional({ example: '2024-12-16T11:48:00.000Z' })
  @IsOptional()
  @IsISO8601()
  purchasedateto?: string;

  @ApiPropertyOptional({ example: '2024-12-16T11:48:00.000Z' })
  @IsOptional()
  @IsISO8601()
  invoicementdatefrom?: string;

  @ApiPropertyOptional({ example: '2024-12-16T11:48:00.000Z' })
  @IsOptional()
  @IsISO8601()
  invoicementdateto?: string;

  @ApiPropertyOptional({ example: 'SP', enum: ['SP', 'HD'] })
  @IsOptional()
  @IsIn(['SP', 'HD'])
  deliverytype?: string;

  @ApiPropertyOptional({ example: 'pending', enum: ['pending', 'invoiced', 'canceled', 'delivered'] })
  @IsOptional()
  @IsIn(['pending', 'invoiced', 'canceled', 'delivered'])
  status?: string;

  @ApiPropertyOptional({ example: 'pending', description: 'Filtra por estado de facturacion' })
  @IsOptional()
  @IsString()
  invoiceStatus?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ name: 'page-size', example: 100, default: 100, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  ['page-size'] = 100;
}
