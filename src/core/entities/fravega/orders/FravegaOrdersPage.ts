export interface FravegaOrderProduct {
  sellerSku: string;
  name: string;
  quantity: number;
  basePrice: number;
  discounts: unknown[];
  subtotal: number;
  imagesUrls: string[];
}

export interface FravegaOrderSummary {
  orderId: number;
  suborderId: string;
  purchaseDate: string;
  documentType: string;
  documentNumber: string;
  clientName: string;
  cuil?: string;
  itemsQuantity: number;
  amount: number;
  deliveryType: string[];
  status: string;
  createdOn: string;
  deliveryStatus: string;
  products: FravegaOrderProduct[];
}

export interface FravegaOrdersPage {
  scrollId: string | null;
  currentPage: number;
  pages: number;
  pageSize: number;
  total: number;
  items: FravegaOrderSummary[];
}
