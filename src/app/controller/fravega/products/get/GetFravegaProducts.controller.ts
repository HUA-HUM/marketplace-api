import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetFravegaProductsService } from 'src/app/services/fravega/products/get/GetFravegaProductsService';
import { PaginatedResult } from 'src/core/entities/common/PaginatedResult';
import { FravegaProduct } from 'src/core/entities/fravega/products/get/FravegaProduct';

@ApiTags('fravega')
@Controller('fravega/products')
export class GetFravegaProductsController {
  constructor(private readonly productsService: GetFravegaProductsService) {}

  @ApiOperation({ summary: 'Listar productos de Fravega con paginado' })
  @ApiQuery({ name: 'limit', required: false, example: 50 })
  @ApiQuery({ name: 'offset', required: false, example: 0 })
  @Get()
  async list(@Query('limit') limit = '50', @Query('offset') offset = '0'): Promise<PaginatedResult<FravegaProduct>> {
    const parsedLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
    const parsedOffset = Math.max(Number(offset) || 0, 0);

    return this.productsService.list({
      limit: parsedLimit,
      offset: parsedOffset
    });
  }
}
