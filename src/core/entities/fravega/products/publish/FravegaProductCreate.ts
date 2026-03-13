export interface FravegaAttribute {
  name: string;
  value: string;
}

export interface FravegaImage {
  type: 'url';
  url: string;
}

export interface FravegaDimensions {
  height: number;
  length: number;
  width: number;
  weight: number;
}

export interface FravegaPrice {
  list: number;
  sale: number;
  net: number;
}

export interface FravegaStock {
  quantity: number;
}

export interface FravegaPublishProduct {
  ean: string;
  origin: string;
  active: boolean;
  title: string;
  subTitle?: string;
  brandId: string;
  countryId: string;
  refId: string;
  primaryCategoryId: string;
  description: string;

  dimensions: FravegaDimensions;

  images: FravegaImage[];

  stock: FravegaStock;

  price: FravegaPrice;

  attributes: FravegaAttribute[];
}
