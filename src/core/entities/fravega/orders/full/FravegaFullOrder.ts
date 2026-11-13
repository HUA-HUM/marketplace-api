import { FravegaOrderDetail } from 'src/core/entities/fravega/orders/FravegaOrderDetail';
import { FravegaOrderSummary } from 'src/core/entities/fravega/orders/FravegaOrdersPage';
import { FravegaVtexOrder } from 'src/core/entities/fravega/vtex/orders/FravegaVtexOrder';

/**
 * Orden de Fravega armada con sus dos backends:
 * - Seller Central: comprador real (email, CUIL), direccion y receptor.
 * - VTEX: telefono, items con ASIN (refId), pago y total cobrado.
 *
 * Montos en pesos (VTEX los devuelve en centavos y se convierten).
 */
export interface FravegaFullOrder {
  orderId: number;
  suborderId: string;
  vtexOrderId: string;
  status: {
    sellerCentral: string;
    // Estado de entrega de Seller Central (Pending, Delivered, Canceled...)
    sellerCentralDelivery: string | null;
    vtex: string | null;
  };
  purchaseDate: string;
  estimatedDeliveryDate: string | null;
  buyer: {
    firstName: string;
    lastName: string;
    fullName: string;
    documentType: string;
    documentNumber: string;
    cuil: string | null;
    email: string | null;
    phone: string | null;
  };
  shipping: {
    type: string | null;
    mode: string | null;
    logisticsOperator: string | null;
    receiverName: string | null;
    street: string | null;
    number: string | null;
    floor: string | null;
    apartment: string | null;
    betweenStreets: string | null;
    references: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    country: string | null;
  };
  items: FravegaFullOrderItem[];
  totals: {
    products: number;
    shipping: number;
    discount: number;
    total: number;
  };
  payments: FravegaFullOrderPayment[];
  /**
   * complete: detalle de Seller Central (por suborden) + VTEX.
   * fallback: el detalle por suborden fallo (Seller Central lo devuelve 500 seguido) y la orden
   * se armo con el listado de Seller Central (CUIL, DNI, productos) + VTEX (direccion, telefono, items).
   */
  source: FravegaFullOrderSource;
  // Datos del comprador que no se pudieron obtener. En fallback siempre falta el email (VTEX lo enmascara)
  missing: FravegaFullOrderMissingField[];
  // Solo en fallback: error del detalle de Seller Central que lo provoco
  fallbackReason?: string;
  // Solo con includeRaw=true: payloads originales de Seller Central y VTEX
  raw?: {
    // En fallback es el item del listado de Seller Central
    sellerCentral: FravegaOrderDetail | FravegaOrderSummary;
    vtex: FravegaVtexOrder;
  };
}

export type FravegaFullOrderSource = 'complete' | 'fallback';

export type FravegaFullOrderMissingField = 'email' | 'cuil';

export interface FravegaFullOrderItem {
  asin: string | null;
  vtexSkuId: string | null;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface FravegaFullOrderPayment {
  method: string | null;
  group: string | null;
  installments: number | null;
  amount: number;
}

export interface FravegaFullOrderError {
  orderId: number;
  suborderId: string;
  source: 'seller-central' | 'vtex';
  message: string;
}

export interface FravegaFullOrdersPage {
  currentPage: number;
  pages: number;
  pageSize: number;
  total: number;
  items: FravegaFullOrder[];
  errors: FravegaFullOrderError[];
}
