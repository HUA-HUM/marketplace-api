import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetMegatoneCategoriesService } from 'src/app/services/megatone/categories/GetMegatoneCategoriesService';

@ApiTags('megatone')
@Controller('megatone/categories')
export class MegatoneCategoriesController {
  constructor(private readonly service: GetMegatoneCategoriesService) {}

  @ApiOperation({
    summary: 'Get Megatone categories by page'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1
  })
  @Get()
  async getByPage(@Query('page') page = 1) {
    return this.service.execute(Number(page));
  }

  @ApiOperation({
    summary: 'Get ALL Megatone categories'
  })
  @Get('all')
  async getAll() {
    return this.service.getAll();
  }
}
