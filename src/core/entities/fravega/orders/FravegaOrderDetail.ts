export interface FravegaOrderDetailProduct {
  sellerSku: string;
  name: string;
  quantity: number;
  basePrice: number;
  discounts: unknown[];
  subtotal: number;
  imagesUrls: string[];
}

export interface FravegaOrderDetailEvent {
  name: string;
  status: string;
}

export interface FravegaOrderDetailAddress {
  street: string;
  number: string;
  floor: string | null;
  apartment: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface FravegaOrderDetailShippingAddress extends FravegaOrderDetailAddress {
  betweenStreets: string | null;
  references: string | null;
  zone: string | null;
  geoCoordinates: { latitude: number; longitude: number } | null;
}

export interface FravegaOrderDetailDelivery {
  type: string;
  logisticsOperator: string;
  deliveryPrice: { basePrice: number; discounts: unknown[] };
  receivers: { firstName: string; lastName: string }[];
  shippingData: {
    mode: string;
    estimatedDeliveryDate: string;
    estimatedDeliveryBusinessDays: number;
    shippingAddress: FravegaOrderDetailShippingAddress;
  };
  products: FravegaOrderDetailProduct[];
}

export interface FravegaOrderDetailBillingInfo {
  status: string;
  billingPerson: {
    name: string;
    email: string;
    document: string;
    documentType: string;
    cuil: string | null;
  };
  billingAddress: FravegaOrderDetailAddress;
  billingDocuments: unknown;
}

export interface FravegaOrderDetail {
  purchaseDate: string;
  buyer: {
    documentNumber: string;
    documentType: string;
    firstName: string;
    lastName: string;
  };
  suborderId: string;
  status: string;
  deliveryStatus: string;
  productsTotal: number;
  deliveriesTotal: number;
  discount: number;
  deliveries: FravegaOrderDetailDelivery[];
  billingInfo: FravegaOrderDetailBillingInfo;
  events: FravegaOrderDetailEvent[];
}
