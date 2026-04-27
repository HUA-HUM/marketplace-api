import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { MegatoneProductsService } from 'src/app/services/megatone/products/get/MegatoneProductsService';

@ApiTags('megatone')
@Controller('/megatone/products')
export class MegatoneProductsController {
  constructor(private readonly productsService: MegatoneProductsService) {}

  @ApiOperation({ summary: 'Listar productos de Megatone (paginado)' })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'offset', required: false, example: 1 })
  @Get()
  async listAll(@Query('limit') limit = '50', @Query('offset') offset = '1') {
    const parsedLimit = Math.min(Number(limit) || 50, 100);
    const parsedOffset = Math.max(Number(offset) || 1, 1);

    return this.productsService.listAll({
      limit: parsedLimit,
      offset: parsedOffset
    });
  }

  @ApiOperation({ summary: 'Listar solo IDs de productos Megatone' })
  @Get('/ids')
  async listIds(@Query('limit') limit = '100', @Query('offset') offset = '1') {
    const parsedLimit = Math.min(Number(limit) || 100, 200);
    const parsedOffset = Math.max(Number(offset) || 1, 1);

    return this.productsService.listIds({
      limit: parsedLimit,
      offset: parsedOffset
    });
  }

  @ApiOperation({ summary: 'Obtener producto Megatone por publicationId' })
  @Get('/:publicationId')
  async getOne(@Param('publicationId') publicationId: string) {
    return this.productsService.getOne(Number(publicationId));
  }
}
