import { Injectable } from '@nestjs/common';
import { IFravegaGetOrdersRepository } from 'src/core/adapters/repositories/fravega/orders/IFravegaGetOrdersRepository';
import { FravegaHttpClient } from '../http/FravegaHttpClient';
import { FravegaOrderDetail } from 'src/core/entities/fravega/orders/FravegaOrderDetail';
import { FravegaOrdersFilters } from 'src/core/entities/fravega/orders/FravegaOrdersFilters';
import { FravegaOrdersPage } from 'src/core/entities/fravega/orders/FravegaOrdersPage';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class FravegaGetOrdersRepository implements IFravegaGetOrdersRepository {
  constructor(private readonly http: FravegaHttpClient) {}

  async list(filters: FravegaOrdersFilters): Promise<FravegaOrdersPage> {
    const config: AxiosRequestConfig = {
      headers: {
        page: filters.page.toString(),
        'page-size': filters.pageSize.toString()
      },
      params: this.buildQueryParams(filters)
    };

    return this.http.get<FravegaOrdersPage>('/api/v1/orders', config);
  }

  async getOne(id: string, orderid: number): Promise<FravegaOrderDetail> {
    return this.http.get<FravegaOrderDetail>(`/api/v1/orders/${encodeURIComponent(id)}?orderid=${orderid}`);
  }

  private buildQueryParams(filters: FravegaOrdersFilters): Record<string, string> {
    const params: Record<string, string> = {};

    if (typeof filters.sku === 'number') params.sku = filters.sku.toString();
    if (typeof filters.docnumber === 'number') params.docnumber = filters.docnumber.toString();
    if (filters.clientname) params.clientname = filters.clientname;
    if (filters.purchasedatefrom) params.purchasedatefrom = filters.purchasedatefrom;
    if (filters.purchasedateto) params.purchasedateto = filters.purchasedateto;
    if (filters.invoicementdatefrom) params.invoicementdatefrom = filters.invoicementdatefrom;
    if (filters.invoicementdateto) params.invoicementdateto = filters.invoicementdateto;
    if (filters.deliverytype) params.deliverytype = filters.deliverytype;
    if (filters.status) params.status = filters.status;
    if (filters.invoiceStatus) params.invoiceStatus = filters.invoiceStatus;

    return params;
  }
}
