import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FravegaGetOrdersService } from 'src/app/services/fravega/orders/FravegaGetOrdersService';
import { FravegaOrderDetail } from 'src/core/entities/fravega/orders/FravegaOrderDetail';
import { FravegaOrdersPage } from 'src/core/entities/fravega/orders/FravegaOrdersPage';
import { GetFravegaOrdersQueryDto } from './dto/GetFravegaOrdersQuery.dto';

@ApiTags('fravega')
@Controller('fravega/orders')
export class FravegaGetOrdersController {
  constructor(private readonly service: FravegaGetOrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar ordenes de Fravega con paginado y filtros' })
  async list(@Query() query: GetFravegaOrdersQueryDto): Promise<FravegaOrdersPage> {
    return this.service.list({
      sku: query.sku,
      docnumber: query.docnumber,
      clientname: query.clientname,
      purchasedatefrom: query.purchasedatefrom,
      purchasedateto: query.purchasedateto,
      invoicementdatefrom: query.invoicementdatefrom,
      invoicementdateto: query.invoicementdateto,
      deliverytype: query.deliverytype,
      status: query.status,
      invoiceStatus: query.invoiceStatus,
      page: query.page,
      pageSize: query['page-size']
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
