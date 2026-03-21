import { Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FravegaDesactivateProductService } from 'src/app/services/fravega/status/desactivate/FravegaDesactivateProductService';

@ApiTags('fravega')
@Controller('fravega/status/desactivate')
export class FravegaDesactivateProductController {
  constructor(private readonly service: FravegaDesactivateProductService) {}

  @Post('id/:id')
  @ApiOperation({ summary: 'Desactivar producto de Fravega por id' })
  @ApiParam({ name: 'id', description: 'Id del producto en Fravega' })
  async desactivateById(@Param('id') id: string) {
    return this.service.byId(id);
  }

  @Post('refId/:refId')
  @ApiOperation({ summary: 'Desactivar producto de Fravega por refId (sku)' })
  @ApiParam({ name: 'refId', description: 'SKU propio / refId del producto' })
  async desactivateBySku(@Param('refId') refId: string) {
    return this.service.bySku(refId);
  }
}
