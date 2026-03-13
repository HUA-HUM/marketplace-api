import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FravegaPublishProductService } from 'src/app/services/fravega/products/publish/FravegaPublishProductService';
import { FravegaPublishProductDto } from './dto/fravega-publish-product.dto';

@ApiTags('fravega')
@Controller('fravega')
export class FravegaPublishProductController {
  constructor(private readonly service: FravegaPublishProductService) {}

  @Post('publish')
  @ApiOperation({
    summary: 'Publicar producto en Fravega'
  })
  @ApiBody({
    type: FravegaPublishProductDto
  })
  @ApiResponse({
    status: 200,
    description: 'Respuesta directa de la API de Fravega'
  })
  async publish(@Body() body: FravegaPublishProductDto) {
    return this.service.publish(body);
  }
}
