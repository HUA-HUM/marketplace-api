export interface FravegaUpdatedItemAttribute {
  a: string;
  t: string;
  v: string;
}

export interface FravegaUpdatedItemStatus {
  code: string;
  message: string;
}

export interface FravegaUpdatedItem {
  id: string;
  sku: string;
  ean: string;
  active: boolean;
  title: string;
  subTitle?: string;
  brandId: string;
  countryId: string;
  refId: string;
  primaryCategoryId: string;
  description: string;
  stock: {
    quantity: number;
  };
  price: {
    list: number;
    sale: number;
  };
  sellerId: string;
  images: string[];
  dimensions: {
    height: number;
    length: number;
    weight: number;
    width: number;
  };
  status: FravegaUpdatedItemStatus;
  itemState: string;
  attributes: FravegaUpdatedItemAttribute[];
}
