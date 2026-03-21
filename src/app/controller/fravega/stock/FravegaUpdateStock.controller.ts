import { Body, Controller, Param, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FravegaUpdateStockService } from 'src/app/services/fravega/stock/FravegaUpdateStockService';
import { FravegaUpdateStock } from 'src/core/entities/fravega/stock/FravegaUpdateStock';
import { UpdateFravegaStockDto } from './dto/UpdateFravegaStock.dto';

@ApiTags('fravega')
@Controller('fravega/stock')
export class FravegaUpdateStockController {
  constructor(private readonly service: FravegaUpdateStockService) {}

  @Put('id/:id')
  @ApiOperation({ summary: 'Actualizar stock de producto de Fravega por id' })
  @ApiParam({ name: 'id', description: 'Id del producto en Fravega' })
  async updateById(@Param('id') id: string, @Body() body: UpdateFravegaStockDto): Promise<FravegaUpdateStock> {
    return this.service.byId(id, body);
  }

  @Put('refId')
  @ApiOperation({ summary: 'Actualizar stock de producto de Fravega por refId (sku)' })
  @ApiQuery({ name: 'refId', required: true, description: 'SKU propio / refId del producto' })
  async updateBySku(
    @Query('refId') refId: string,
    @Body() body: UpdateFravegaStockDto
  ): Promise<FravegaUpdateStock> {
    return this.service.bySku(refId, body);
  }
}
