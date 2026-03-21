export interface FravegaOrderProduct {
  sellerSku: number;
  name: string;
  quantity: number;
  basePrice: number;
  discounts: number;
  subtotal: number;
  imagesUrls: string[];
}

export interface FravegaOrderSummary {
  orderId: string;
  suborderId: string;
  purchaseDate: string;
  documentType: string;
  documentNumber: string;
  clientName: string;
  itemsQuantity: number;
  deliveryType: 'SP' | 'HD';
  status: string;
  createdOn: string;
  deliveryStatus: string;
  products: FravegaOrderProduct[];
}

export interface FravegaOrdersPage {
  currentPage: number;
  pages: number;
  pageSize: number;
  total: number;
  items: FravegaOrderSummary[];
}
