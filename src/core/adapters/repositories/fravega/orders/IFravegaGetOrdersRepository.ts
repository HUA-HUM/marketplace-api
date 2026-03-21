import { FravegaOrderDetail } from 'src/core/entities/fravega/orders/FravegaOrderDetail';
import { FravegaOrdersFilters } from 'src/core/entities/fravega/orders/FravegaOrdersFilters';
import { FravegaOrdersPage } from 'src/core/entities/fravega/orders/FravegaOrdersPage';

export interface IFravegaGetOrdersRepository {
  list(filters: FravegaOrdersFilters): Promise<FravegaOrdersPage>;
  getOne(id: string, orderid: number): Promise<FravegaOrderDetail>;
}
