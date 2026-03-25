import { Body, Controller, HttpException, Param, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FravegaUpdateItemService } from 'src/app/services/fravega/update/FravegaUpdateItemService';
import { UpdateFravegaAttributesDto } from './dto/UpdateFravegaAttributes.dto';
import { UpdateFravegaItemDto } from './dto/UpdateFravegaItem.dto';
import { FravegaUpdatedItem } from 'src/core/entities/fravega/update/FravegaUpdatedItem';
import { FravegaHttpError } from 'src/core/drivers/repositories/fravega/http/error/FravegaHttpError';

@ApiTags('fravega')
@Controller('fravega/update')
export class FravegaUpdateItemController {
  constructor(private readonly service: FravegaUpdateItemService) {}

  @Put('Id/:id')
  @ApiOperation({ summary: 'Actualizar item completo de Fravega por id' })
  @ApiParam({ name: 'id', description: 'Id del item en Fravega' })
  @ApiBody({
    type: UpdateFravegaItemDto,
    description: 'Schema completo esperado por Fravega para update de item'
  })
  async updateById(@Param('id') id: string, @Body() body: UpdateFravegaItemDto): Promise<FravegaUpdatedItem> {
    try {
      return this.service.byId(id, body);
    } catch (error) {
      throw this.mapFravegaError(error);
    }
  }

  @Put('refeId/:refId')
  @ApiOperation({ summary: 'Actualizar item completo de Fravega por refId' })
  @ApiParam({ name: 'refId', description: 'RefId / SKU del item' })
  @ApiBody({
    type: UpdateFravegaItemDto,
    description: 'Schema completo esperado por Fravega para update de item'
  })
  async updateByRefId(
    @Param('refId') refId: string,
    @Body() body: UpdateFravegaItemDto
  ): Promise<FravegaUpdatedItem> {
    try {
      return this.service.byRefId(refId, body);
    } catch (error) {
      throw this.mapFravegaError(error);
    }
  }

  @Put('refeId/:refId/attributes')
  @ApiOperation({ summary: 'Actualizar atributos de item de Fravega por refId' })
  @ApiParam({ name: 'refId', description: 'RefId / SKU del item' })
  async updateAttributesByRefId(
    @Param('refId') refId: string,
    @Body() body: UpdateFravegaAttributesDto
  ): Promise<FravegaUpdatedItem> {
    try {
      return this.service.attributesByRefId(refId, body);
    } catch (error) {
      throw this.mapFravegaError(error);
    }
  }

  private mapFravegaError(error: unknown): HttpException {
    if (error instanceof FravegaHttpError) {
      throw new HttpException(error.data ?? { message: error.message }, error.status ?? 500);
    }

    throw new HttpException({ message: 'Internal server error' }, 500);
  }
}
