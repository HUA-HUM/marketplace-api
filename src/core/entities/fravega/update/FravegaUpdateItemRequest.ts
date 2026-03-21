export interface FravegaUpdateItemImage {
  Type: string;
  Id?: string;
  Url?: string;
}

export interface FravegaUpdateItemRequest {
  images: FravegaUpdateItemImage[];
}
