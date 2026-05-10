import { Body, Controller, HttpException, Param, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateFravegaPriceDto } from './dto/UpdateFravegaPrice.dto';
import { FravegaUpdatePriceService } from 'src/app/services/fravega/price/FravegaUpdatePriceService';
import { FravegaHttpError } from 'src/core/drivers/repositories/fravega/http/error/FravegaHttpError';

@ApiTags('fravega')
@Controller('fravega/price')
export class FravegaUpdatePriceController {
  constructor(private readonly service: FravegaUpdatePriceService) {}

  @Put('id/:id')
  @ApiOperation({ summary: 'Actualizar precio de producto de Fravega por id' })
  @ApiParam({ name: 'id', description: 'Id del producto en Fravega' })
  @ApiBody({ type: UpdateFravegaPriceDto })
  async updateById(@Param('id') id: string, @Body() body: UpdateFravegaPriceDto) {
    try {
      return await this.service.byId(id, body);
    } catch (error) {
      throw this.mapFravegaError(error);
    }
  }

  @Put('refId/:refId')
  @ApiOperation({ summary: 'Actualizar precio de producto de Fravega por refId (sku)' })
  @ApiParam({ name: 'refId', description: 'SKU propio / refId del producto' })
  @ApiBody({ type: UpdateFravegaPriceDto })
  async updateBySku(@Param('refId') refId: string, @Body() body: UpdateFravegaPriceDto) {
    try {
      return await this.service.bySku(refId, body);
    } catch (error) {
      throw this.mapFravegaError(error);
    }
  }

  private mapFravegaError(error: unknown): HttpException {
    if (error instanceof FravegaHttpError) {
      throw new HttpException(
        {
          message: 'Frávega rechazó la actualización de precio',
          upstreamStatusCode: error.status,
          upstreamResponse: error.data,
          type: error.type,
          detail: error.message
        },
        error.status && error.status >= 400 && error.status < 500 ? error.status : 502
      );
    }

    throw new HttpException({ message: 'Internal server error' }, 500);
  }
}
