import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetOnCityTreeCategoriesService } from 'src/app/services/oncity/categories/GetOnCityTreeCategoriesService';

@ApiTags('oncity')
@Controller('oncity/categories')
export class GetOnCityTreeCategoriesController {
  constructor(private readonly service: GetOnCityTreeCategoriesService) {}

  @ApiOperation({
    summary: 'Listar arbol completo de categorias OnCity',
    description: 'Consulta VTEX con el path fijo /api/catalog_system/pvt/category/tree/645.'
  })
  @Get('tree')
  async execute(): Promise<unknown> {
    return this.service.execute();
  }
}
