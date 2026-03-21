export interface FravegaOrdersFilters {
  sku?: number;
  docnumber?: number;
  clientname?: string;
  purchasedatefrom?: string;
  purchasedateto?: string;
  invoicementdatefrom?: string;
  invoicementdateto?: string;
  deliverytype?: string;
  status?: string;
  invoiceStatus?: string;
  page: number;
  pageSize: number;
}
