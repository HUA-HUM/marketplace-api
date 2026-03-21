import { Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FravegaActivateProductService } from 'src/app/services/fravega/status/activate/FravegaActivateProductService';

@ApiTags('fravega')
@Controller('fravega/status/activate')
export class FravegaActivateProductController {
  constructor(private readonly service: FravegaActivateProductService) {}

  @Post('id/:id')
  @ApiOperation({ summary: 'Activar producto de Fravega por id' })
  @ApiParam({ name: 'id', description: 'Id del producto en Fravega' })
  async activateById(@Param('id') id: string) {
    return this.service.byId(id);
  }

  @Post('refId/:refId')
  @ApiOperation({ summary: 'Activar producto de Fravega por refId (sku)' })
  @ApiParam({ name: 'refId', description: 'SKU propio / refId del producto' })
  async activateBySku(@Param('refId') refId: string) {
    return this.service.bySku(refId);
  }
}
