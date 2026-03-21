import { Body, Controller, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateFravegaPriceDto } from './dto/UpdateFravegaPrice.dto';
import { FravegaUpdatePriceService } from 'src/app/services/fravega/price/FravegaUpdatePriceService';

@ApiTags('fravega')
@Controller('fravega/price')
export class FravegaUpdatePriceController {
  constructor(private readonly service: FravegaUpdatePriceService) {}

  @Put('id/:id')
  @ApiOperation({ summary: 'Actualizar precio de producto de Fravega por id' })
  @ApiParam({ name: 'id', description: 'Id del producto en Fravega' })
  async updateById(@Param('id') id: string, @Body() body: UpdateFravegaPriceDto) {
    return this.service.byId(id, body);
  }

  @Put('refId/:refId')
  @ApiOperation({ summary: 'Actualizar precio de producto de Fravega por refId (sku)' })
  @ApiParam({ name: 'refId', description: 'SKU propio / refId del producto' })
  async updateBySku(@Param('refId') refId: string, @Body() body: UpdateFravegaPriceDto) {
    return this.service.bySku(refId, body);
  }
}
