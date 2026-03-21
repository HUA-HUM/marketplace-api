export interface FravegaOrderDetailProduct {
  sellerSku: number;
  name: string;
  quantity: number;
  basePrice: number;
  discounts: number;
  subtotal: number;
  imageUrl: string;
}

export interface FravegaOrderDetailEvent {
  name: string;
  status: string;
}

export interface FravegaOrderDetail {
  purchaseDate: string;
  buyer: {
    documentNumber: string;
    cuil?: string;
    firstName: string;
    lastName: string;
    documentType: string;
  };
  suborderId: string;
  status: string;
  productsTotal: number;
  deliveriesTotal: number;
  discount: number;
  deliveries: unknown;
  products: FravegaOrderDetailProduct[];
  shippingData: unknown;
  billingInfo: unknown;
  sellerId: string;
  sellerName: string;
  events: FravegaOrderDetailEvent[];
}
