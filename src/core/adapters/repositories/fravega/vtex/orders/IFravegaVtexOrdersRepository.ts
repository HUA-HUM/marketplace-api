import { FravegaVtexOrder } from 'src/core/entities/fravega/vtex/orders/FravegaVtexOrder';
import { FravegaVtexOrderInvoicing } from 'src/core/entities/fravega/vtex/orders/FravegaVtexOrderInvoicing';

export interface IFravegaVtexOrdersRepository {
  listOrders(params?: Record<string, string>): Promise<unknown>;
  getOrder(orderId: string): Promise<FravegaVtexOrder>;
  getInvoicing(orderId: string): Promise<FravegaVtexOrderInvoicing>;
}
