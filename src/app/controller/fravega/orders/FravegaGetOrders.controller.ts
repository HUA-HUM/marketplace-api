import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FravegaGetOrdersService } from 'src/app/services/fravega/orders/FravegaGetOrdersService';
import { FravegaOrderDetail } from 'src/core/entities/fravega/orders/FravegaOrderDetail';
import { FravegaOrdersPage } from 'src/core/entities/fravega/orders/FravegaOrdersPage';

@ApiTags('fravega')
@Controller('fravega/orders')
export class FravegaGetOrdersController {
  constructor(private readonly service: FravegaGetOrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar ordenes de Fravega con paginado y filtros',
    description:
      'Reenvia los filtros permitidos por Fravega como query params y envia page / page-size en headers hacia Seller Center.'
  })
  @ApiQuery({ name: 'sku', required: false, type: Number, description: 'Filtra por sellerSku' })
  @ApiQuery({ name: 'docnumber', required: false, type: Number, description: 'Filtra por documento del cliente' })
  @ApiQuery({ name: 'clientname', required: false, type: String, description: 'Filtra por nombre del cliente' })
  @ApiQuery({ name: 'purchasedatefrom', required: false, type: String, description: 'Fecha desde ISO8601' })
  @ApiQuery({ name: 'purchasedateto', required: false, type: String, description: 'Fecha hasta ISO8601' })
  @ApiQuery({ name: 'invoicementdatefrom', required: false, type: String, description: 'Fecha facturacion desde ISO8601' })
  @ApiQuery({ name: 'invoicementdateto', required: false, type: String, description: 'Fecha facturacion hasta ISO8601' })
  @ApiQuery({ name: 'deliverytype', required: false, enum: ['SP', 'HD'] })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'invoiced', 'canceled', 'delivered'] })
  @ApiQuery({ name: 'invoiceStatus', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'page-size', required: false, type: Number, example: 100 })
  async list(
    @Query('sku') sku?: string,
    @Query('docnumber') docnumber?: string,
    @Query('clientname') clientname?: string,
    @Query('purchasedatefrom') purchasedatefrom?: string,
    @Query('purchasedateto') purchasedateto?: string,
    @Query('invoicementdatefrom') invoicementdatefrom?: string,
    @Query('invoicementdateto') invoicementdateto?: string,
    @Query('deliverytype') deliverytype?: string,
    @Query('status') status?: string,
    @Query('invoiceStatus') invoiceStatus?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('page-size', new DefaultValuePipe(100), ParseIntPipe) pageSize?: number
  ): Promise<FravegaOrdersPage> {
    return this.service.list({
      sku: sku ? Number(sku) : undefined,
      docnumber: docnumber ? Number(docnumber) : undefined,
      clientname,
      purchasedatefrom,
      purchasedateto,
      invoicementdatefrom,
      invoicementdateto,
      deliverytype,
      status,
      invoiceStatus,
      page: Math.max(page ?? 1, 1),
      pageSize: Math.min(Math.max(pageSize ?? 100, 1), 100)
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de suborden de Fravega' })
  @ApiParam({ name: 'id', description: 'http://localhost:3000/fravega/orders?page=1&page-size=100' })
  @ApiParam({ name: 'id', description: 'Identificador de orden' })
  @ApiQuery({ name: 'orderid', required: true, type: Number, description: 'Identificador de suborden' })
  async getOne(@Param('id') id: string, @Query('orderid') orderid: string): Promise<FravegaOrderDetail> {
    return this.service.getOne(id, Number(orderid));
  }
}
