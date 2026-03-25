import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateFravegaItemImageDto {
  @ApiProperty({
    description: 'Tipo de imagen informado por Fravega',
    example: 'url'
  })
  @IsString()
  Type: string;

  @ApiPropertyOptional({
    description: 'Id interno de imagen',
    example: '123'
  })
  @IsOptional()
  @IsString()
  Id?: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen',
    example: 'https://example.com/image.jpg'
  })
  @IsOptional()
  @IsString()
  Url?: string;
}

export class UpdateFravegaItemDimensionsDocDto {
  @ApiProperty({ example: 10 })
  @IsNumber()
  height: number;

  @ApiProperty({ example: 20 })
  @IsNumber()
  length: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  weight: number;

  @ApiProperty({ example: 15 })
  @IsNumber()
  width: number;
}

export class UpdateFravegaItemDto {
  @ApiProperty({ example: '7791234567890' })
  @IsString()
  ean: string;

  @ApiProperty({ example: 'Argentina' })
  @IsString()
  origin: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  active: boolean;

  @ApiProperty({ example: 'Heladera No Frost 400L' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Color inox' })
  @IsOptional()
  @IsString()
  subTitle?: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  brandId: string;

  @ApiProperty({ example: 'AR' })
  @IsString()
  countryId: string;

  @ApiProperty({ example: 'SKU-1234' })
  @IsString()
  refId: string;

  @ApiProperty({ example: '5678' })
  @IsString()
  primaryCategoryId: string;

  @ApiProperty({ example: 'Descripcion del producto' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 'https://example.com/video.mp4' })
  @IsOptional()
  @IsString()
  video?: string;

  @ApiProperty({ type: UpdateFravegaItemDimensionsDocDto })
  @ValidateNested()
  @Type(() => UpdateFravegaItemDimensionsDocDto)
  dimensions: UpdateFravegaItemDimensionsDocDto;

  @ApiProperty({
    type: [UpdateFravegaItemImageDto]
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => UpdateFravegaItemImageDto)
  images: UpdateFravegaItemImageDto[];
}
