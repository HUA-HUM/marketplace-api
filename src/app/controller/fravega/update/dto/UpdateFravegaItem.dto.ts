import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

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

export class UpdateFravegaItemDto {
  @ApiProperty({
    type: [UpdateFravegaItemImageDto],
    description: 'Unico campo permitido para update parcial actual'
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => UpdateFravegaItemImageDto)
  images: UpdateFravegaItemImageDto[];
}
