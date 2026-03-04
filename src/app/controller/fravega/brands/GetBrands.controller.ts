import { Controller, Get, Injectable } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetBrandsService } from 'src/app/services/fravega/brands/GetBrandsService';
import { FravegaBrand } from 'src/core/entities/fravega/brands/FravegaBrand';

@ApiTags('fravega')
@Controller('fravega/brands')
export class GetBrandsController {
  constructor(private readonly brandService: GetBrandsService) {}

  @ApiOperation({ summary: 'Listar todas las marcas de Fravega' })
  @Get()
  async GetAllBrands(): Promise<FravegaBrand[]> {
    return this.brandService.GetAllBrands();
  }
}
