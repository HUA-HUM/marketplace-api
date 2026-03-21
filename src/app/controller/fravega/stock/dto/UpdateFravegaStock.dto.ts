import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class UpdateFravegaStockDto {
  @ApiProperty({
    description: 'Cantidad en stock del producto',
    example: 10
  })
  @IsInt()
  quantity: number;
}
