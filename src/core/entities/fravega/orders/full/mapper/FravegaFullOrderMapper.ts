import { FravegaOrderDetail } from 'src/core/entities/fravega/orders/FravegaOrderDetail';
import { FravegaOrderSummary } from 'src/core/entities/fravega/orders/FravegaOrdersPage';
import { FravegaVtexOrder } from 'src/core/entities/fravega/vtex/orders/FravegaVtexOrder';
import {
  FravegaFullOrder,
  FravegaFullOrderItem,
  FravegaFullOrderMissingField,
  FravegaFullOrderPayment
} from 'src/core/entities/fravega/orders/full/FravegaFullOrder';

/* Campos de la orden VTEX OMS que se usan para completar la orden */
interface VtexOrderFields {
  status?: string;
  value?: number;
  clientProfileData?: {
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
  };
  shippingData?: {
    address?: {
      receiverName?: string | null;
      street?: string | null;
      number?: string | null;
      complement?: string | null;
      reference?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      country?: string | null;
    };
    logisticsInfo?: {
      shippingEstimateDate?: string | null;
      selectedSla?: string | null;
      deliveryCompany?: string | null;
    }[];
  };
  totals?: { id?: string; value?: number }[];
  items?: VtexOrderItem[];
  paymentData?: { transactions?: { payments?: VtexOrderPayment[] }[] };
}

interface VtexOrderItem {
  id?: string;
  refId?: string | null;
  name?: string;
  quantity?: number;
  sellingPrice?: number;
}

interface VtexOrderPayment {
  paymentSystemName?: string;
  group?: string;
  installments?: number;
  value?: number;
}

/* VTEX expresa montos en centavos */
const fromCents = (value?: number): number => (typeof value === 'number' ? value / 100 : 0);

const blankToNull = (value?: string | null): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

export class FravegaFullOrderMapper {
  static toEntity(params: {
    orderId: number;
    vtexOrderId: string;
    detail: FravegaOrderDetail;
    vtexOrder: FravegaVtexOrder;
    includeRaw?: boolean;
  }): FravegaFullOrder {
    const { orderId, vtexOrderId, detail, vtexOrder, includeRaw = false } = params;
    const vtex = vtexOrder as VtexOrderFields;

    const delivery = detail.deliveries?.[0];
    const address = delivery?.shippingData?.shippingAddress;
    const receiver = delivery?.receivers?.[0];
    const billingPerson = detail.billingInfo?.billingPerson;

    const receiverName = receiver
      ? `${receiver.firstName ?? ''} ${receiver.lastName ?? ''}`.trim()
      : (vtex.shippingData?.address?.receiverName ?? null);

    const buyer = {
      firstName: detail.buyer.firstName,
      lastName: detail.buyer.lastName,
      fullName: `${detail.buyer.firstName} ${detail.buyer.lastName}`.trim(),
      documentType: detail.buyer.documentType,
      documentNumber: detail.buyer.documentNumber,
      cuil: billingPerson?.cuil ?? null,
      // VTEX enmascara el email (@ct.vtex.com.br): el real solo viene en Seller Central
      email: billingPerson?.email ?? null,
      phone: vtex.clientProfileData?.phone ?? null
    };

    return {
      orderId,
      suborderId: detail.suborderId,
      vtexOrderId,
      status: {
        sellerCentral: detail.status,
        sellerCentralDelivery: detail.deliveryStatus ?? null,
        vtex: vtex.status ?? null
      },
      purchaseDate: detail.purchaseDate,
      estimatedDeliveryDate: delivery?.shippingData?.estimatedDeliveryDate ?? null,

      buyer,

      shipping: {
        type: delivery?.type ?? null,
        mode: delivery?.shippingData?.mode ?? null,
        logisticsOperator: delivery?.logisticsOperator ?? null,
        receiverName: receiverName || null,
        street: address?.street ?? null,
        number: address?.number ?? null,
        floor: address?.floor ?? null,
        apartment: address?.apartment ?? null,
        betweenStreets: address?.betweenStreets ?? null,
        references: address?.references ?? null,
        city: address?.city ?? null,
        state: address?.state ?? null,
        zipCode: address?.zipCode ?? null,
        country: address?.country ?? null
      },

      items: FravegaFullOrderMapper.toItems(vtex),

      totals: {
        products: detail.productsTotal,
        shipping: detail.deliveriesTotal,
        discount: detail.discount,
        total: fromCents(vtex.value)
      },

      payments: FravegaFullOrderMapper.toPayments(vtex),

      source: 'complete',
      missing: FravegaFullOrderMapper.missingFields(buyer),

      ...(includeRaw && {
        raw: {
          sellerCentral: detail,
          vtex: vtexOrder
        }
      })
    };
  }

  /**
   * Arma la orden cuando el detalle de Seller Central (por suborden) falla.
   * - Listado de Seller Central: CUIL, DNI, nombre, estado, fecha y montos (en pesos).
   * - VTEX: direccion, telefono, items con ASIN, pago y total (en centavos).
   * El email real solo viene en el detalle de Seller Central: queda en null y se informa en `missing`.
   */
  static fromSummary(params: {
    vtexOrderId: string;
    summary: FravegaOrderSummary;
    vtexOrder: FravegaVtexOrder;
    fallbackReason: string;
    includeRaw?: boolean;
  }): FravegaFullOrder {
    const { vtexOrderId, summary, vtexOrder, fallbackReason, includeRaw = false } = params;
    const vtex = vtexOrder as VtexOrderFields;
    const profile = vtex.clientProfileData;
    const address = vtex.shippingData?.address;
    const logistics = vtex.shippingData?.logisticsInfo?.[0];

    const firstName = blankToNull(profile?.firstName) ?? '';
    const lastName = blankToNull(profile?.lastName) ?? '';
    const fullName = blankToNull(summary.clientName) ?? `${firstName} ${lastName}`.trim();

    const buyer = {
      firstName,
      lastName,
      fullName,
      documentType: summary.documentType,
      documentNumber: summary.documentNumber,
      cuil: blankToNull(summary.cuil),
      email: null,
      phone: profile?.phone ?? null
    };

    const vtexShipping = vtex.totals?.find(total => total.id === 'Shipping')?.value;
    const vtexDiscounts = vtex.totals?.find(total => total.id === 'Discounts')?.value;

    return {
      orderId: summary.orderId,
      suborderId: summary.suborderId,
      vtexOrderId,
      status: {
        sellerCentral: summary.status,
        sellerCentralDelivery: summary.deliveryStatus ?? null,
        vtex: vtex.status ?? null
      },
      purchaseDate: summary.purchaseDate,
      estimatedDeliveryDate: logistics?.shippingEstimateDate ?? null,

      buyer,

      shipping: {
        type: summary.deliveryType?.[0] ?? null,
        mode: logistics?.selectedSla ?? null,
        logisticsOperator: logistics?.deliveryCompany ?? null,
        receiverName: blankToNull(address?.receiverName),
        street: address?.street ?? null,
        number: address?.number ?? null,
        floor: null,
        apartment: blankToNull(address?.complement),
        betweenStreets: null,
        references: blankToNull(address?.reference),
        city: address?.city ?? null,
        state: address?.state ?? null,
        zipCode: address?.postalCode ?? null,
        country: address?.country ?? null
      },

      items: FravegaFullOrderMapper.toItems(vtex),

      totals: {
        // El listado ya viene en pesos
        products: summary.amount,
        shipping: fromCents(vtexShipping),
        // VTEX informa los descuentos en negativo
        discount: Math.abs(fromCents(vtexDiscounts)),
        total: fromCents(vtex.value)
      },

      payments: FravegaFullOrderMapper.toPayments(vtex),

      source: 'fallback',
      missing: FravegaFullOrderMapper.missingFields(buyer),
      fallbackReason,

      ...(includeRaw && {
        raw: {
          sellerCentral: summary,
          vtex: vtexOrder
        }
      })
    };
  }

  private static missingFields(buyer: { cuil: string | null; email: string | null }): FravegaFullOrderMissingField[] {
    const missing: FravegaFullOrderMissingField[] = [];
    if (!buyer.email) missing.push('email');
    if (!buyer.cuil) missing.push('cuil');
    return missing;
  }

  private static toItems(vtex: VtexOrderFields): FravegaFullOrderItem[] {
    return (vtex.items ?? []).map(item => FravegaFullOrderMapper.toItem(item));
  }

  private static toPayments(vtex: VtexOrderFields): FravegaFullOrderPayment[] {
    return (vtex.paymentData?.transactions ?? [])
      .flatMap(transaction => transaction.payments ?? [])
      .map(payment => FravegaFullOrderMapper.toPayment(payment));
  }

  private static toItem(item: VtexOrderItem): FravegaFullOrderItem {
    const quantity = item.quantity ?? 0;
    const unitPrice = fromCents(item.sellingPrice);

    return {
      // refId en VTEX es el ASIN del producto
      asin: item.refId ?? null,
      vtexSkuId: item.id ?? null,
      name: item.name ?? '',
      quantity,
      unitPrice,
      total: unitPrice * quantity
    };
  }

  private static toPayment(payment: VtexOrderPayment): FravegaFullOrderPayment {
    return {
      method: payment.paymentSystemName ?? null,
      group: payment.group ?? null,
      installments: payment.installments ?? null,
      // Incluye intereses de cuotas: puede ser mayor al total de la orden
      amount: fromCents(payment.value)
    };
  }
}
