import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested
} from 'class-validator';

export class GoogleProductShippingDto {
  @ApiProperty({ example: 'AR' })
  @IsString()
  country: string;

  @ApiPropertyOptional({ example: 'Envio a domicilio' })
  @IsOptional()
  @IsString()
  service?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  minHandlingTime?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxHandlingTime?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(0)
  minTransitTime?: number;

  @ApiPropertyOptional({ example: 7 })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxTransitTime?: number;
}

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

  @ApiPropertyOptional({
    example: [
      'https://tienda.loquieroaca.com/images/SKU123-2.jpg',
      'https://tienda.loquieroaca.com/images/SKU123-3.jpg'
    ]
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  additionalImageUrls?: string[];

  @ApiPropertyOptional({ example: 'new' })
  @IsOptional()
  @IsString()
  condition?: string;

  @ApiPropertyOptional({ example: 'Apparel & Accessories > Handbags, Wallets & Cases' })
  @IsOptional()
  @IsString()
  googleProductCategory?: string;

  @ApiPropertyOptional({ example: ['012345678905'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gtins?: string[];

  @ApiPropertyOptional({ example: 'MP-1404-L' })
  @IsOptional()
  @IsString()
  mpn?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  identifierExists?: boolean;

  @ApiPropertyOptional({ type: [GoogleProductShippingDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GoogleProductShippingDto)
  shipping?: GoogleProductShippingDto[];
}
