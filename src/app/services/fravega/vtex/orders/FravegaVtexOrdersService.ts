import { Inject, Injectable } from '@nestjs/common';
import { IFravegaVtexOrdersRepository } from 'src/core/adapters/repositories/fravega/vtex/orders/IFravegaVtexOrdersRepository';
import { FravegaVtexOrder } from 'src/core/entities/fravega/vtex/orders/FravegaVtexOrder';
import { FravegaVtexOrderInvoicing } from 'src/core/entities/fravega/vtex/orders/FravegaVtexOrderInvoicing';

@Injectable()
export class FravegaVtexOrdersService {
  constructor(
    @Inject('IFravegaVtexOrdersRepository')
    private readonly repository: IFravegaVtexOrdersRepository
  ) {}

  listOrders(params?: Record<string, string>): Promise<unknown> {
    return this.repository.listOrders(params);
  }

  getOrder(orderId: string): Promise<FravegaVtexOrder> {
    return this.repository.getOrder(orderId);
  }

  getInvoicing(orderId: string): Promise<FravegaVtexOrderInvoicing> {
    return this.repository.getInvoicing(orderId);
  }
}
