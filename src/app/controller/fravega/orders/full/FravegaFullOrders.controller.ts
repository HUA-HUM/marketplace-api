import { BadRequestException, Controller, Get, HttpException, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetFravegaFullOrdersService } from 'src/app/services/fravega/orders/full/GetFravegaFullOrdersService';
import { FravegaFullOrder, FravegaFullOrdersPage } from 'src/core/entities/fravega/orders/full/FravegaFullOrder';
import { FravegaHttpError } from 'src/core/drivers/repositories/fravega/http/error/FravegaHttpError';
import { FravegaVtexHttpError } from 'src/core/drivers/repositories/fravega/vtex/http/errors/FravegaVtexHttpError';
import { GetFravegaFullOrdersQueryDto } from './dto/GetFravegaFullOrdersQuery.dto';

@ApiTags('fravega')
@Controller('fravega/full-orders')
export class FravegaFullOrdersController {
  constructor(private readonly service: GetFravegaFullOrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar ordenes de Fravega completas (Seller Central + VTEX)',
    description:
      'Por cada suborden del listado de Seller Central obtiene su detalle (email, CUIL, direccion) y la orden VTEX FVG-{suborderId} (telefono, items con ASIN, pago). ' +
      'Las ordenes que fallan no cortan la pagina: se informan en `errors`. ' +
      'Fravega puede devolver menos items que page-size aunque haya mas paginas: recorrer hasta `pages`.'
  })
  async list(@Query() query: GetFravegaFullOrdersQueryDto): Promise<FravegaFullOrdersPage> {
    try {
      return await this.service.list(
        {
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
        },
        query.includeRaw ?? false
      );
    } catch (error) {
      throw this.mapUpstreamError(error);
    }
  }

  @Get(':suborderId')
  @ApiOperation({ summary: 'Obtener una orden de Fravega completa (Seller Central + VTEX)' })
  @ApiParam({ name: 'suborderId', description: 'Identificador de suborden. Ejemplo: v88506252frvg-01' })
  @ApiQuery({
    name: 'orderid',
    required: true,
    type: Number,
    description: 'Identificador numerico de la orden en Seller Central. Ejemplo: 17951297'
  })
  @ApiQuery({
    name: 'includeRaw',
    required: false,
    type: Boolean,
    description: 'Incluye los payloads originales de Seller Central y VTEX (respuesta mucho mas pesada)'
  })
  async getOne(
    @Param('suborderId') suborderId: string,
    @Query('orderid', ParseIntPipe) orderId: number,
    @Query('includeRaw') includeRaw?: string
  ): Promise<FravegaFullOrder> {
    const withRaw = this.parseIncludeRaw(includeRaw);

    try {
      return await this.service.getOne(suborderId, orderId, withRaw);
    } catch (error) {
      throw this.mapUpstreamError(error);
    }
  }

  // Se parsea a mano: con un parametro boolean el ValidationPipe global convierte cualquier texto en false
  private parseIncludeRaw(value?: string): boolean {
    if (value === undefined || value === 'false') return false;
    if (value === 'true') return true;
    throw new BadRequestException('includeRaw debe ser true o false');
  }

  private mapUpstreamError(error: unknown): HttpException {
    if (error instanceof FravegaHttpError || error instanceof FravegaVtexHttpError) {
      const status = error instanceof FravegaHttpError ? error.status : error.statusCode;

      return new HttpException(
        {
          message:
            error instanceof FravegaHttpError
              ? 'Fravega Seller Central rechazó la consulta de la orden'
              : 'VTEX rechazó la consulta de la orden de Fravega',
          upstreamStatusCode: status,
          upstreamResponse: error.data,
          type: error.type,
          detail: error.message
        },
        status && status >= 400 && status < 500 ? status : 502
      );
    }

    return new HttpException({ message: 'Internal server error' }, 500);
  }
}
