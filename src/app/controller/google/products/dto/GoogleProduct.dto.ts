import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class GoogleProductDto {
  @ApiProperty({ example: 'SKU123' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 'Producto' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Descripcion del producto' })
  @IsString()
  description: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ example: 'Marca' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ example: 'https://tienda.loquieroaca.com/images/SKU123.jpg' })
  @IsUrl()
  imageUrl: string;

  @ApiProperty({ example: 'https://tienda.loquieroaca.com/producto/SKU123' })
  @IsUrl()
  productUrl: string;
}
