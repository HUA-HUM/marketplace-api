import { Controller, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FravegaAprobeProductService } from 'src/app/services/fravega/status/aprobe/FravegaAprobeProductService';

@ApiTags('fravega')
@Controller('fravega/status/aprobe')
export class FravegaAprobeProductController {
  constructor(private readonly service: FravegaAprobeProductService) {}

  @Patch('id/:id/request-approval')
  @ApiOperation({ summary: 'Solicitar aprobacion de producto de Fravega por id' })
  @ApiParam({ name: 'id', description: 'Id del producto en Fravega' })
  async aprobeById(@Param('id') id: string) {
    return this.service.byId(id);
  }

  @Patch('refId/:refId/request-approval')
  @ApiOperation({ summary: 'Solicitar aprobacion de producto de Fravega por refId (sku)' })
  @ApiParam({ name: 'refId', description: 'SKU propio / refId del producto' })
  async aprobeBySku(@Param('refId') refId: string) {
    return this.service.bySku(refId);
  }
}
