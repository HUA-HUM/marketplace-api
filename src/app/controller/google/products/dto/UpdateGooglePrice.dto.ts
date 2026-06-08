import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateGooglePriceDto {
  @ApiProperty({ example: 1000 })
  @IsNumber()
  @Min(0)
  price: number;
}
