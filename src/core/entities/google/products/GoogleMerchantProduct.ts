export interface GoogleMerchantProduct {
  sku: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  brand?: string;
  imageUrl: string;
  productUrl: string;
}
