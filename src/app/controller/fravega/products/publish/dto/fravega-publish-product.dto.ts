import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/* ================= ATTRIBUTES ================= */

export class FravegaAttributeDto {
  @ApiProperty({ example: 'Color' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Negro',
    oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }]
  })
  @ValidateIf((_, value) => typeof value === 'string')
  @IsString()
  @ValidateIf((_, value) => typeof value === 'number')
  @IsNumber()
  @ValidateIf((_, value) => typeof value === 'boolean')
  @IsBoolean()
  value: string | number | boolean;
}
/* ================= IMAGES ================= */

export class FravegaImageDto {
  @ApiProperty({
    example: 'id',
    enum: ['id', 'url']
  })
  @IsString()
  type: 'id' | 'url';

  @ApiProperty({ example: 'abc123', required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'https://via.placeholder.com/600', required: false })
  @IsOptional()
  @IsString()
  url?: string;
}

/* ================= DIMENSIONS ================= */

export class FravegaDimensionsDto {
  @ApiProperty({ example: 10 })
  @IsNumber()
  height: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  length: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  width: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  weight: number;
}

/* ================= STOCK ================= */

export class FravegaStockDto {
  @ApiProperty({ example: 10 })
  @IsNumber()
  quantity: number;
}

/* ================= PRICE ================= */

export class FravegaPriceDto {
  @ApiProperty({ example: 100000 })
  @IsNumber()
  list: number;

  @ApiProperty({ example: 90000 })
  @IsNumber()
  sale: number;

  @ApiProperty({ example: 80000 })
  @IsNumber()
  net: number;
}

/* ================= MAIN DTO ================= */

export class FravegaPublishProductDto {
  @ApiProperty({ example: '21341231234' })
  @IsString()
  ean: string;

  @ApiProperty({ example: 'AR' })
  @IsString()
  origin: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  active: boolean;

  @ApiProperty({ example: 'Producto Test API Arturo' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Producto de prueba integración', required: false })
  @IsOptional()
  @IsString()
  subTitle?: string;

  @ApiProperty({ example: '680bb81d04ea6bb67da79013' })
  @IsString()
  brandId: string;

  @ApiProperty({ example: 'AR' })
  @IsString()
  countryId: string;

  @ApiProperty({ example: 'TEST-ARTURO-API-003' })
  @IsString()
  refId: string;

  @ApiProperty({ example: '5a301bf41400008a004913a6' })
  @IsString()
  primaryCategoryId: string;

  @ApiProperty({
    example: 'Producto creado desde integración API para pruebas.'
  })
  @IsString()
  description: string;

  @ApiProperty({ type: FravegaDimensionsDto })
  @ValidateNested()
  @Type(() => FravegaDimensionsDto)
  dimensions: FravegaDimensionsDto;

  @ApiProperty({ type: [FravegaImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FravegaImageDto)
  images: FravegaImageDto[];

  @ApiProperty({ type: FravegaStockDto })
  @ValidateNested()
  @Type(() => FravegaStockDto)
  stock: FravegaStockDto;

  @ApiProperty({ type: FravegaPriceDto })
  @ValidateNested()
  @Type(() => FravegaPriceDto)
  price: FravegaPriceDto;

  @ApiProperty({ type: [FravegaAttributeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FravegaAttributeDto)
  attributes: FravegaAttributeDto[];
}
