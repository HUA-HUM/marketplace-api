import { Injectable } from '@nestjs/common';
import { FravegaOrdersFilters } from 'src/core/entities/fravega/orders/FravegaOrdersFilters';
import { FravegaFullOrder, FravegaFullOrdersPage } from 'src/core/entities/fravega/orders/full/FravegaFullOrder';
import { GetFravegaFullOrders } from 'src/core/interactor/fravega/GetFravegaFullOrders';

@Injectable()
export class GetFravegaFullOrdersService {
  constructor(private readonly getFullOrdersInteractor: GetFravegaFullOrders) {}

  async list(filters: FravegaOrdersFilters, includeRaw = false): Promise<FravegaFullOrdersPage> {
    return this.getFullOrdersInteractor.list(filters, includeRaw);
  }

  async getOne(suborderId: string, orderId: number, includeRaw = false): Promise<FravegaFullOrder> {
    return this.getFullOrdersInteractor.getOne(suborderId, orderId, includeRaw);
  }
}
