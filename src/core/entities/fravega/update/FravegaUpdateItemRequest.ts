export interface FravegaUpdateItemImage {
  Type: string;
  Id?: string;
  Url?: string;
}

export interface FravegaUpdateItemDimensions {
  height: number;
  length: number;
  weight: number;
  width: number;
}

export interface FravegaUpdateItemRequest {
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
  video?: string;
  dimensions: FravegaUpdateItemDimensions;
  images: FravegaUpdateItemImage[];
}
