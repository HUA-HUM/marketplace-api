import { Controller, Get, HttpException, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FravegaVtexOrdersService } from 'src/app/services/fravega/vtex/orders/FravegaVtexOrdersService';
import { FravegaVtexOrder } from 'src/core/entities/fravega/vtex/orders/FravegaVtexOrder';
import { FravegaVtexOrderInvoicing } from 'src/core/entities/fravega/vtex/orders/FravegaVtexOrderInvoicing';
import { FravegaVtexHttpError } from 'src/core/drivers/repositories/fravega/vtex/http/errors/FravegaVtexHttpError';

@ApiTags('fravega-vtex')
@Controller('fravega/vtex/orders')
export class FravegaVtexOrdersController {
  constructor(private readonly service: FravegaVtexOrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar ordenes Fravega desde VTEX OMS',
    description:
      'Proxy raw al endpoint /api/oms/pvt/orders de la cuenta VTEX de Fravega. Reenvia query params opcionales a VTEX.'
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'f_creationDate', required: false, type: String })
  @ApiQuery({ name: 'f_status', required: false, type: String })
  async listOrders(@Query() query: Record<string, string>): Promise<unknown> {
    try {
      return await this.service.listOrders(query);
    } catch (error) {
      throw this.mapVtexError(error);
    }
  }

  @Get(':orderId/invoicing')
  @ApiOperation({
    summary: 'Obtener datos de facturacion de una orden Fravega en VTEX',
    description:
      'Consulta VTEX OMS y devuelve los bloques invoiceData, packageAttachment, paymentData, clientProfileData y shippingData.'
  })
  @ApiParam({ name: 'orderId', example: 'FVG-v91512983frvg-01' })
  async getInvoicing(@Param('orderId') orderId: string): Promise<FravegaVtexOrderInvoicing> {
    try {
      return await this.service.getInvoicing(orderId);
    } catch (error) {
      throw this.mapVtexError(error);
    }
  }

  @Get(':orderId')
  @ApiOperation({
    summary: 'Obtener orden Fravega desde VTEX OMS',
    description: 'Proxy raw al endpoint /api/oms/pvt/orders/{orderId} de la cuenta VTEX de Fravega.'
  })
  @ApiParam({ name: 'orderId', example: 'FVG-v91512983frvg-01' })
  async getOrder(@Param('orderId') orderId: string): Promise<FravegaVtexOrder> {
    try {
      return await this.service.getOrder(orderId);
    } catch (error) {
      throw this.mapVtexError(error);
    }
  }

  private mapVtexError(error: unknown): HttpException {
    if (error instanceof FravegaVtexHttpError) {
      return new HttpException(
        {
          message: 'VTEX rechazó la operación de Fravega',
          upstreamStatusCode: error.statusCode,
          upstreamResponse: error.data,
          type: error.type,
          detail: error.message
        },
        error.statusCode && error.statusCode >= 400 && error.statusCode < 500 ? error.statusCode : 502
      );
    }

    return new HttpException({ message: 'Internal server error' }, 500);
  }
}
