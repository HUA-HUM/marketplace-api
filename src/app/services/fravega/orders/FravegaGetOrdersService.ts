import { Inject, Injectable } from '@nestjs/common';
import { IFravegaGetOrdersRepository } from 'src/core/adapters/repositories/fravega/orders/IFravegaGetOrdersRepository';
import { FravegaOrderDetail } from 'src/core/entities/fravega/orders/FravegaOrderDetail';
import { FravegaOrdersFilters } from 'src/core/entities/fravega/orders/FravegaOrdersFilters';
import { FravegaOrdersPage } from 'src/core/entities/fravega/orders/FravegaOrdersPage';

@Injectable()
export class FravegaGetOrdersService {
  constructor(
    @Inject('IFravegaGetOrdersRepository')
    private readonly ordersRepository: IFravegaGetOrdersRepository
  ) {}

  async list(filters: FravegaOrdersFilters): Promise<FravegaOrdersPage> {
    return this.ordersRepository.list(filters);
  }

  async getOne(id: string, orderid: number): Promise<FravegaOrderDetail> {
    return this.ordersRepository.getOne(id, orderid);
  }
}
