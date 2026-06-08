import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateGoogleStockDto {
  @ApiProperty({ example: 15 })
  @IsInt()
  @Min(0)
  stock: number;
}
