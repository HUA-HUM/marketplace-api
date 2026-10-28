import { FravegaOrderDetail } from 'src/core/entities/fravega/orders/FravegaOrderDetail';
import { FravegaVtexOrder } from 'src/core/entities/fravega/vtex/orders/FravegaVtexOrder';
import {
  FravegaFullOrder,
  FravegaFullOrderItem,
  FravegaFullOrderPayment
} from 'src/core/entities/fravega/orders/full/FravegaFullOrder';

/* Campos de la orden VTEX OMS que se usan para completar la orden */
interface VtexOrderFields {
  status?: string;
  value?: number;
  clientProfileData?: { phone?: string | null };
  shippingData?: { address?: { receiverName?: string | null } };
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

export class FravegaFullOrderMapper {
  static toEntity(params: {
    orderId: number;
    vtexOrderId: string;
    detail: FravegaOrderDetail;
    vtexOrder: FravegaVtexOrder;
  }): FravegaFullOrder {
    const { orderId, vtexOrderId, detail, vtexOrder } = params;
    const vtex = vtexOrder as VtexOrderFields;

    const delivery = detail.deliveries?.[0];
    const address = delivery?.shippingData?.shippingAddress;
    const receiver = delivery?.receivers?.[0];
    const billingPerson = detail.billingInfo?.billingPerson;

    const receiverName = receiver
      ? `${receiver.firstName ?? ''} ${receiver.lastName ?? ''}`.trim()
      : (vtex.shippingData?.address?.receiverName ?? null);

    return {
      orderId,
      suborderId: detail.suborderId,
      vtexOrderId,
      status: {
        sellerCentral: detail.status,
        vtex: vtex.status ?? null
      },
      purchaseDate: detail.purchaseDate,
      estimatedDeliveryDate: delivery?.shippingData?.estimatedDeliveryDate ?? null,

      buyer: {
        firstName: detail.buyer.firstName,
        lastName: detail.buyer.lastName,
        fullName: `${detail.buyer.firstName} ${detail.buyer.lastName}`.trim(),
        documentType: detail.buyer.documentType,
        documentNumber: detail.buyer.documentNumber,
        cuil: billingPerson?.cuil ?? null,
        // VTEX enmascara el email (@ct.vtex.com.br): el real solo viene en Seller Central
        email: billingPerson?.email ?? null,
        phone: vtex.clientProfileData?.phone ?? null
      },

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

      items: (vtex.items ?? []).map(item => FravegaFullOrderMapper.toItem(item)),

      totals: {
        products: detail.productsTotal,
        shipping: detail.deliveriesTotal,
        discount: detail.discount,
        total: fromCents(vtex.value)
      },

      payments: (vtex.paymentData?.transactions ?? [])
        .flatMap(transaction => transaction.payments ?? [])
        .map(payment => FravegaFullOrderMapper.toPayment(payment)),

      raw: {
        sellerCentral: detail,
        vtex: vtexOrder
      }
    };
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
