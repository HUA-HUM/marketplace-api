import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetMegatoneBrandsService } from 'src/app/services/megatone/brands/GetMegatoneBrandsServices';

@ApiTags('megatone')
@Controller('megatone/brands')
export class MegatoneBrandsController {
  constructor(private readonly service: GetMegatoneBrandsService) {}

  @ApiOperation({
    summary: 'Get Megatone brands by page'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'List of Megatone brands',
    schema: {
      type: 'object',
      properties: {
        page: { type: 'number', example: 1 },
        count: { type: 'number', example: 10 },
        brands: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              codigo: { type: 'number', example: 85 },
              descripcion: { type: 'string', example: 'CRISTAR' }
            }
          }
        }
      }
    }
  })
  @Get()
  async getByPage(@Query('page') page = 1) {
    return this.service.execute(Number(page));
  }

  @ApiOperation({
    summary: 'Get ALL Megatone brands (paginated loop)'
  })
  @ApiResponse({
    status: 200,
    description: 'All Megatone brands',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 10052 },
        brands: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              codigo: { type: 'number', example: 85 },
              descripcion: { type: 'string', example: 'CRISTAR' }
            }
          }
        }
      }
    }
  })
  @Get('all')
  async getAll() {
    return this.service.getAll();
  }
}
