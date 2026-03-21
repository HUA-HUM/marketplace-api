import { Injectable } from '@nestjs/common';
import { IFravegaGetOrdersRepository } from 'src/core/adapters/repositories/fravega/orders/IFravegaGetOrdersRepository';
import { FravegaHttpClient } from '../http/FravegaHttpClient';
import { FravegaOrderDetail } from 'src/core/entities/fravega/orders/FravegaOrderDetail';
import { FravegaOrdersFilters } from 'src/core/entities/fravega/orders/FravegaOrdersFilters';
import { FravegaOrdersPage } from 'src/core/entities/fravega/orders/FravegaOrdersPage';

@Injectable()
export class FravegaGetOrdersRepository implements IFravegaGetOrdersRepository {
  constructor(private readonly http: FravegaHttpClient) {}

  async list(filters: FravegaOrdersFilters): Promise<FravegaOrdersPage> {
    const query = new URLSearchParams();

    if (typeof filters.sku === 'number') query.set('sku', filters.sku.toString());
    if (typeof filters.docnumber === 'number') query.set('docnumber', filters.docnumber.toString());
    if (filters.clientname) query.set('clientname', filters.clientname);
    if (filters.purchasedatefrom) query.set('purchasedatefrom', filters.purchasedatefrom);
    if (filters.purchasedateto) query.set('purchasedateto', filters.purchasedateto);
    if (filters.invoicementdatefrom) query.set('invoicementdatefrom', filters.invoicementdatefrom);
    if (filters.invoicementdateto) query.set('invoicementdateto', filters.invoicementdateto);
    if (filters.deliverytype) query.set('deliverytype', filters.deliverytype);
    if (filters.status) query.set('status', filters.status);
    if (filters.invoiceStatus) query.set('invoiceStatus', filters.invoiceStatus);

    const url = query.size > 0 ? `/api/v1/orders?${query.toString()}` : '/api/v1/orders';

    return this.http.get<FravegaOrdersPage>(url, {
      headers: {
        page: filters.page.toString(),
        'page-size': filters.pageSize.toString()
      }
    });
  }

  async getOne(id: string, orderid: number): Promise<FravegaOrderDetail> {
    return this.http.get<FravegaOrderDetail>(`/api/v1/orders/${encodeURIComponent(id)}?orderid=${orderid}`);
  }
}
