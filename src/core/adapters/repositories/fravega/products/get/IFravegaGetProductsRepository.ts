import { PaginationParams } from 'src/core/entities/common/Pagination';
import { PaginatedResult } from 'src/core/entities/common/PaginatedResult';
import { FravegaProduct } from 'src/core/entities/fravega/products/get/FravegaProduct';

export interface IFravegaGetProductsRepository {
  list(pagination: PaginationParams): Promise<PaginatedResult<FravegaProduct>>;
}
