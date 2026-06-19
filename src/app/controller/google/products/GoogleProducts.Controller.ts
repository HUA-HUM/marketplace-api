import { BadRequestException, Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DeleteGoogleProductService } from 'src/app/services/google/products/DeleteGoogleProductService';
import { GetGoogleProductPerformanceService } from 'src/app/services/google/products/GetGoogleProductPerformanceService';
import { GetGoogleProductService } from 'src/app/services/google/products/GetGoogleProductService';
import { PublishGoogleProductService } from 'src/app/services/google/products/PublishGoogleProductService';
import { UpdateGooglePriceService } from 'src/app/services/google/products/UpdateGooglePriceService';
import { UpdateGoogleStatusService } from 'src/app/services/google/products/UpdateGoogleStatusService';
import { UpdateGoogleStockService } from 'src/app/services/google/products/UpdateGoogleStockService';
import { GoogleMerchantConfig } from 'src/core/drivers/repositories/google/config/GoogleMerchantConfig';
import { GoogleMerchantHttpError } from 'src/core/drivers/repositories/google/http/errors/GoogleMerchantHttpError';
import { GetGooglePerformanceQueryDto } from './dto/GetGooglePerformanceQuery.dto';
import { GoogleProductIdentityQueryDto } from './dto/GoogleProductIdentityQuery.dto';
import { GoogleProductDto } from './dto/GoogleProduct.dto';
import { ListGoogleProductsQueryDto } from './dto/ListGoogleProductsQuery.dto';
import { UpdateGooglePriceDto } from './dto/UpdateGooglePrice.dto';
import { UpdateGoogleStockDto } from './dto/UpdateGoogleStock.dto';

@ApiTags('google')
@Controller('internal/google-merchant/products')
export class GoogleProductsController {
  constructor(
    private readonly publishGoogleProductService: PublishGoogleProductService,
    private readonly getGoogleProductService: GetGoogleProductService,
    private readonly deleteGoogleProductService: DeleteGoogleProductService,
    private readonly getGoogleProductPerformanceService: GetGoogleProductPerformanceService,
    private readonly updateGooglePriceService: UpdateGooglePriceService,
    private readonly updateGoogleStockService: UpdateGoogleStockService,
    private readonly updateGoogleStatusService: UpdateGoogleStatusService,
    private readonly config: GoogleMerchantConfig
  ) {}

  @Post()
  @ApiOperation({ summary: 'Publicar producto en Google Merchant' })
  @ApiBody({ type: GoogleProductDto })
  async publish(@Body() body: GoogleProductDto): Promise<unknown> {
    try {
      this.assertStoreUrl(body.productUrl);
      return await this.publishGoogleProductService.execute(body);
    } catch (error) {
      throw this.mapGoogleError(error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar productos procesados en Google Merchant con paginado' })
  @ApiQuery({ name: 'pageSize', required: false, example: 25 })
  @ApiQuery({ name: 'pageToken', required: false })
  async list(@Query() query: ListGoogleProductsQueryDto): Promise<unknown> {
    try {
      return await this.getGoogleProductService.list({
        pageSize: query.pageSize,
        pageToken: query.pageToken
      });
    } catch (error) {
      throw this.mapGoogleError(error);
    }
  }

  @Patch(':sku')
  @ApiOperation({ summary: 'Actualizar producto completo en Google Merchant' })
  @ApiParam({ name: 'sku', description: 'SKU / offerId del producto' })
  @ApiBody({ type: GoogleProductDto })
  async update(@Param('sku') sku: string, @Body() body: GoogleProductDto): Promise<unknown> {
    try {
      this.assertStoreUrl(body.productUrl);
      return await this.publishGoogleProductService.execute({ ...body, sku });
    } catch (error) {
      throw this.mapGoogleError(error);
    }
  }

  @Patch(':sku/price')
  @ApiOperation({ summary: 'Actualizar precio de producto en Google Merchant' })
  @ApiParam({ name: 'sku', description: 'SKU / offerId del producto' })
  @ApiBody({ type: UpdateGooglePriceDto })
  async updatePrice(@Param('sku') sku: string, @Body() body: UpdateGooglePriceDto): Promise<unknown> {
    try {
      return await this.updateGooglePriceService.execute(sku, body.price);
    } catch (error) {
      throw this.mapGoogleError(error);
    }
  }

  @Patch(':sku/stock')
  @ApiOperation({ summary: 'Actualizar stock de producto en Google Merchant' })
  @ApiParam({ name: 'sku', description: 'SKU / offerId del producto' })
  @ApiBody({ type: UpdateGoogleStockDto })
  async updateStock(@Param('sku') sku: string, @Body() body: UpdateGoogleStockDto): Promise<unknown> {
    try {
      return await this.updateGoogleStockService.execute(sku, body.stock);
    } catch (error) {
      throw this.mapGoogleError(error);
    }
  }

  @Patch(':sku/out-of-stock')
  @ApiOperation({ summary: 'Marcar producto pausado como OUT_OF_STOCK en Google Merchant' })
  @ApiParam({ name: 'sku', description: 'SKU / offerId del producto' })
  async markOutOfStock(@Param('sku') sku: string): Promise<unknown> {
    try {
      return await this.updateGoogleStatusService.markOutOfStock(sku);
    } catch (error) {
      throw this.mapGoogleError(error);
    }
  }

  @Get(':sku/performance')
  @ApiOperation({ summary: 'Consultar clicks, impresiones y CTR de un producto en Google Merchant' })
  @ApiParam({ name: 'sku', description: 'SKU / offerId del producto' })
  @ApiQuery({ name: 'from', required: false, example: '2026-06-01' })
  @ApiQuery({ name: 'to', required: false, example: '2026-06-08' })
  async performance(@Param('sku') sku: string, @Query() query: GetGooglePerformanceQueryDto): Promise<unknown> {
    try {
      return await this.getGoogleProductPerformanceService.execute({
        sku,
        from: query.from,
        to: query.to
      });
    } catch (error) {
      throw this.mapGoogleError(error);
    }
  }

  @Get(':sku')
  @ApiOperation({ summary: 'Consultar producto en Google Merchant' })
  @ApiParam({ name: 'sku', description: 'SKU / offerId del producto' })
  @ApiQuery({ name: 'contentLanguage', required: false, example: 'es' })
  @ApiQuery({ name: 'feedLabel', required: false, example: 'AR' })
  async get(@Param('sku') sku: string, @Query() query: GoogleProductIdentityQueryDto): Promise<unknown> {
    try {
      return await this.getGoogleProductService.execute({
        sku,
        contentLanguage: query.contentLanguage,
        feedLabel: query.feedLabel
      });
    } catch (error) {
      throw this.mapGoogleError(error);
    }
  }

  @Delete(':sku')
  @ApiOperation({ summary: 'Eliminar producto de Google Merchant' })
  @ApiParam({ name: 'sku', description: 'SKU / offerId del producto' })
  @ApiQuery({ name: 'contentLanguage', required: false, example: 'es' })
  @ApiQuery({ name: 'feedLabel', required: false, example: 'AR' })
  async delete(@Param('sku') sku: string, @Query() query: GoogleProductIdentityQueryDto): Promise<unknown> {
    try {
      return await this.deleteGoogleProductService.execute({
        sku,
        contentLanguage: query.contentLanguage,
        feedLabel: query.feedLabel
      });
    } catch (error) {
      throw this.mapGoogleError(error);
    }
  }

  private assertStoreUrl(productUrl: string): void {
    if (!productUrl.startsWith(this.config.storeBaseUrl)) {
      throw new BadRequestException({
        message: 'Google Merchant productUrl debe apuntar a nuestra tienda',
        expectedBaseUrl: this.config.storeBaseUrl,
        receivedUrl: productUrl
      });
    }
  }

  private mapGoogleError(error: unknown): HttpException {
    if (error instanceof BadRequestException) {
      return error;
    }

    if (error instanceof GoogleMerchantHttpError) {
      return new HttpException(
        {
          message: 'Google Merchant rechazó la operación',
          upstreamStatusCode: error.status,
          upstreamResponse: error.data,
          type: error.type,
          detail: error.message
        },
        error.status && error.status >= 400 && error.status < 500 ? error.status : 502
      );
    }

    return new HttpException({ message: 'Internal server error' }, 500);
  }
}
