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
  });

  it('includes the raw payloads when includeRaw is true', () => {
    expect(build(true).raw).toEqual({ sellerCentral: detail, vtex: vtexOrder });
  });
});
