export interface FravegaProduct {
  id?: string | number;
  sku?: string;
  ean?: string;
  title?: string;
  active?: boolean;
  [key: string]: unknown;
}
