import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCategorieTreeService } from 'src/app/services/fravega/categories/GetCategorieTreeService';

@ApiTags('fravega')
@Controller('fravega/categoriesTree')
export class GetCategoriesTreeController {
  constructor(private readonly categoriesTreeService: GetCategorieTreeService) {}

  @ApiOperation({ summary: 'Listar todas el arbol de categorias de Fravega' })
  @Get()
  async GetAllCategorieTree(): Promise<any> {
    try {
      return this.categoriesTreeService.getCategoriesTree();
    } catch (error) {
      console.log(error);
    }
  }
}
