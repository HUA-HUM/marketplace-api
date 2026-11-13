import { FravegaOrderDetail } from 'src/core/entities/fravega/orders/FravegaOrderDetail';
import { FravegaFullOrderMapper } from './FravegaFullOrderMapper';

describe('FravegaFullOrderMapper', () => {
  const detail = {
    purchaseDate: '2026-10-03T01:27:38.512Z',
    buyer: { documentNumber: '25327587', documentType: 'DNI', firstName: 'Gabriela', lastName: 'Hidalgo' },
    suborderId: 'v1frvg-01',
    status: 'Created',
    deliveryStatus: 'Pending',
    productsTotal: 1000,
    deliveriesTotal: 0,
    discount: 0,
    deliveries: [],
    billingInfo: {
      status: 'Pending',
      billingPerson: {
        name: 'G',
        email: 'g@example.com',
        document: '25327587',
        documentType: 'DNI',
        cuil: '27253275877'
      }
    },
    events: []
  } as unknown as FravegaOrderDetail;

  const vtexOrder = { status: 'ready-for-handling', value: 100000, items: [] };

  const build = (includeRaw?: boolean) =>
    FravegaFullOrderMapper.toEntity({ orderId: 1, vtexOrderId: 'FVG-v1frvg-01', detail, vtexOrder, includeRaw });

  it('omits the raw payloads by default', () => {
    const order = build();

    expect(order).not.toHaveProperty('raw');
    expect(order.buyer).toMatchObject({ cuil: '27253275877', email: 'g@example.com' });
    expect(order.totals.total).toBe(1000);
    expect(order.status).toEqual({
      sellerCentral: 'Created',
      sellerCentralDelivery: 'Pending',
      vtex: 'ready-for-handling'
    });
  });

  it('includes the raw payloads when includeRaw is true', () => {
    expect(build(true).raw).toEqual({ sellerCentral: detail, vtex: vtexOrder });
  });

  it('marks a complete order with nothing missing', () => {
    expect(build()).toMatchObject({ source: 'complete', missing: [] });
    expect(build()).not.toHaveProperty('fallbackReason');
  });

  describe('fromSummary (fallback when the Seller Central detail fails)', () => {
    const summary = {
      orderId: 20277852,
      suborderId: 'v95020273frvg-01',
      purchaseDate: '2026-11-12T19:28:12.576Z',
      documentType: 'DNI',
      documentNumber: '30123456',
      clientName: 'Juana Perez',
      cuil: '27301234567',
      itemsQuantity: 1,
      amount: 367247,
      deliveryType: ['HomeDelivery'],
      status: 'Created',
      createdOn: '2026-11-12T19:30:24.209Z',
      deliveryStatus: 'Pending',
      products: []
    };

    const fallbackVtex = {
      status: 'ready-for-handling',
      value: 36724700,
      totals: [
        { id: 'Items', value: 36724700 },
        { id: 'Shipping', value: 150000 },
        { id: 'Discounts', value: -50000 }
      ],
      clientProfileData: {
        email: 'abc@ct.vtex.com.br',
        firstName: 'Juana',
        lastName: 'Perez',
        document: '30123456',
        phone: '+5491100000000'
      },
      shippingData: {
        address: {
          receiverName: 'Juana Perez',
          street: 'Calle',
          number: '123',
          complement: '2B',
          reference: '',
          city: 'CABA',
          state: 'Buenos Aires',
          postalCode: '1414',
          country: 'ARG'
        },
        logisticsInfo: [
          { shippingEstimateDate: '2026-11-18T00:00:00Z', selectedSla: 'Normal', deliveryCompany: 'Andreani' }
        ]
      },
      items: [{ id: '1', refId: 'B0ASIN', name: 'Heladera', quantity: 1, sellingPrice: 36724700 }],
      paymentData: {
        transactions: [
          { payments: [{ paymentSystemName: 'Visa', group: 'creditCard', installments: 1, value: 36724700 }] }
        ]
      }
    };

    const fallback = (includeRaw?: boolean) =>
      FravegaFullOrderMapper.fromSummary({
        vtexOrderId: 'FVG-v95020273frvg-01',
        summary,
        vtexOrder: fallbackVtex,
        fallbackReason: '[FRAVEGA GET] ... → 500',
        includeRaw
      });

    it('takes the CUIL and DNI from the Seller Central list and leaves the email missing', () => {
      const order = fallback();

      expect(order).toMatchObject({
        orderId: 20277852,
        suborderId: 'v95020273frvg-01',
        purchaseDate: '2026-11-12T19:28:12.576Z',
        source: 'fallback',
        missing: ['email'],
        fallbackReason: '[FRAVEGA GET] ... → 500'
      });
      expect(order.buyer).toEqual({
        firstName: 'Juana',
        lastName: 'Perez',
        fullName: 'Juana Perez',
        documentType: 'DNI',
        documentNumber: '30123456',
        cuil: '27301234567',
        // nunca el email enmascarado de VTEX
        email: null,
        phone: '+5491100000000'
      });
    });

    it('takes status from Seller Central and shipping, items and totals from VTEX', () => {
      const order = fallback();

      expect(order.status).toEqual({
        sellerCentral: 'Created',
        sellerCentralDelivery: 'Pending',
        vtex: 'ready-for-handling'
      });
      expect(order.shipping).toMatchObject({
        type: 'HomeDelivery',
        mode: 'Normal',
        logisticsOperator: 'Andreani',
        receiverName: 'Juana Perez',
        street: 'Calle',
        number: '123',
        apartment: '2B',
        references: null,
        city: 'CABA',
        state: 'Buenos Aires',
        zipCode: '1414'
      });
      expect(order.estimatedDeliveryDate).toBe('2026-11-18T00:00:00Z');
      expect(order.items).toEqual([
        { asin: 'B0ASIN', vtexSkuId: '1', name: 'Heladera', quantity: 1, unitPrice: 367247, total: 367247 }
      ]);
      expect(order.totals).toEqual({ products: 367247, shipping: 1500, discount: 500, total: 367247 });
      expect(order.payments).toEqual([{ method: 'Visa', group: 'creditCard', installments: 1, amount: 367247 }]);
    });

    it('reports the CUIL as missing when the list has none', () => {
      const order = FravegaFullOrderMapper.fromSummary({
        vtexOrderId: 'FVG-v1',
        summary: { ...summary, cuil: '' },
        vtexOrder: fallbackVtex,
        fallbackReason: 'boom'
      });

      expect(order.buyer.cuil).toBeNull();
      expect(order.missing).toEqual(['email', 'cuil']);
    });

    it('includes the list item as the Seller Central raw payload', () => {
      expect(fallback(true).raw).toEqual({ sellerCentral: summary, vtex: fallbackVtex });
      expect(fallback()).not.toHaveProperty('raw');
    });
  });
});
