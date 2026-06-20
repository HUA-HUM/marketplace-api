export interface GoogleMerchantShipping {
  country: string;
  service?: string;
  price?: number;
  minHandlingTime?: number;
  maxHandlingTime?: number;
  minTransitTime?: number;
  maxTransitTime?: number;
}

export interface GoogleMerchantProduct {
  sku: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  brand?: string;
  imageUrl: string;
  productUrl: string;
  additionalImageUrls?: string[];
  condition?: string;
  googleProductCategory?: string;
  gtins?: string[];
  mpn?: string;
  identifierExists?: boolean;
  shipping?: GoogleMerchantShipping[];
}
