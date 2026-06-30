export interface FravegaVtexInvoiceSummary {
  invoiceNumber?: string;
  invoiceValue?: number;
  invoiceUrl?: string;
  issuanceDate?: string;
  invoiceKey?: string;
  type?: string;
  trackingNumber?: string;
  courier?: string;
  embeddedInvoice?: string;
}

export interface FravegaVtexOrderInvoicing {
  orderId?: string;
  sequence?: string;
  status?: string;
  value?: number;
  creationDate?: string;
  invoiceData?: unknown;
  packageAttachment?: unknown;
  paymentData?: unknown;
  clientProfileData?: unknown;
  shippingData?: unknown;
  invoices: FravegaVtexInvoiceSummary[];
}
