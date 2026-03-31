import { FravegaProduct } from './FravegaProduct';

export type FravegaProductsApiResponse =
  | FravegaProduct[]
  | {
      items?: FravegaProduct[];
      data?: FravegaProduct[];
      results?: FravegaProduct[];
      total?: number;
      count?: number;
      totalCount?: number;
      size?: number;
      limit?: number;
      offset?: number;
      pageSize?: number;
      page?: number;
      [key: string]: unknown;
    };
