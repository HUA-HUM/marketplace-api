import { IFravegaGetOrdersRepository } from 'src/core/adapters/repositories/fravega/orders/IFravegaGetOrdersRepository';
import { IFravegaVtexOrdersRepository } from 'src/core/adapters/repositories/fravega/vtex/orders/IFravegaVtexOrdersRepository';
import { FravegaOrderDetail } from 'src/core/entities/fravega/orders/FravegaOrderDetail';
import { FravegaOrderSummary } from 'src/core/entities/fravega/orders/FravegaOrdersPage';
import { GetFravegaFullOrders } from './GetFravegaFullOrders';

describe('GetFravegaFullOrders', () => {
  let sellerCentral: jest.Mocked<IFravegaGetOrdersRepository>;
  let vtex: jest.Mocked<IFravegaVtexOrdersRepository>;
  let interactor: GetFravegaFullOrders;
  // Referencia propia al mock: evita pasar un metodo suelto a expect (unbound-method)
  let listMock: jest.Mock;

  const summary: FravegaOrderSummary = {
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

  const listPage = (items: FravegaOrderSummary[]) => ({
    scrollId: null,
    currentPage: 1,
    pages: 1,
    pageSize: 50,
    total: items.length,
    items
  });

  const detail = {
    suborderId: 'v95020273frvg-01',
    purchaseDate: '2026-11-12T19:28:12.576Z',
    status: 'Created',
    deliveryStatus: 'Pending',
    buyer: { firstName: 'Juana', lastName: 'Perez', documentType: 'DNI', documentNumber: '30123456' },
    billingInfo: { billingPerson: { email: 'juana@example.com', cuil: '27301234567' } },
    deliveries: [],
    productsTotal: 367247,
    deliveriesTotal: 0,
    discount: 0
  } as unknown as FravegaOrderDetail;

  const vtexOrder = {
    status: 'ready-for-handling',
    value: 36724700,
    clientProfileData: { email: 'x@ct.vtex.com.br', firstName: 'Juana', lastName: 'Perez', document: '30123456' },
    items: []
  };

  const sellerCentral500 = new Error('[FRAVEGA GET] /api/v1/orders/v95020273frvg-01?orderid=20277852 → 500');

  beforeEach(() => {
    listMock = jest.fn();
    sellerCentral = { list: listMock, getOne: jest.fn() };
    vtex = { listOrders: jest.fn(), getOrder: jest.fn(), getInvoicing: jest.fn() };
    interactor = new GetFravegaFullOrders(sellerCentral, vtex);
  });

  describe('list', () => {
    it('returns the complete order when the Seller Central detail works', async () => {
      sellerCentral.list.mockResolvedValue(listPage([summary]));
      sellerCentral.getOne.mockResolvedValue(detail);
      vtex.getOrder.mockResolvedValue(vtexOrder);

      const page = await interactor.list({ page: 1, pageSize: 50 });

      expect(page.errors).toEqual([]);
      expect(page.items[0]).toMatchObject({ source: 'complete', missing: [] });
      expect(page.items[0].buyer.email).toBe('juana@example.com');
    });

    it('falls back to the list item + VTEX when the detail by suborder fails', async () => {
      sellerCentral.list.mockResolvedValue(listPage([summary]));
      sellerCentral.getOne.mockRejectedValue(sellerCentral500);
      vtex.getOrder.mockResolvedValue(vtexOrder);

      const page = await interactor.list({ page: 1, pageSize: 50 });

      expect(page.errors).toEqual([]);
      expect(page.items[0]).toMatchObject({
        orderId: 20277852,
        source: 'fallback',
        missing: ['email'],
        fallbackReason: sellerCentral500.message
      });
      expect(page.items[0].buyer).toMatchObject({ cuil: '27301234567', email: null });
      // Con el item del listado ya en mano no se vuelve a consultar
      expect(listMock).toHaveBeenCalledTimes(1);
    });

    it('reports a vtex error when VTEX fails', async () => {
      sellerCentral.list.mockResolvedValue(listPage([summary]));
      sellerCentral.getOne.mockResolvedValue(detail);
      vtex.getOrder.mockRejectedValue(new Error('vtex down'));

      const page = await interactor.list({ page: 1, pageSize: 50 });

      expect(page.items).toEqual([]);
      expect(page.errors).toEqual([
        { orderId: 20277852, suborderId: 'v95020273frvg-01', source: 'vtex', message: 'vtex down' }
      ]);
    });

    it('reports the seller-central error when both backends fail', async () => {
      sellerCentral.list.mockResolvedValue(listPage([summary]));
      sellerCentral.getOne.mockRejectedValue(sellerCentral500);
      vtex.getOrder.mockRejectedValue(new Error('vtex down'));

      const page = await interactor.list({ page: 1, pageSize: 50 });

      expect(page.items).toEqual([]);
      expect(page.errors).toEqual([
        {
          orderId: 20277852,
          suborderId: 'v95020273frvg-01',
          source: 'seller-central',
          message: sellerCentral500.message
        }
      ]);
    });
  });

  describe('getOne', () => {
    it('finds the list item by the VTEX document when the detail fails', async () => {
      sellerCentral.getOne.mockRejectedValue(sellerCentral500);
      vtex.getOrder.mockResolvedValue(vtexOrder);
      sellerCentral.list.mockResolvedValue(listPage([{ ...summary, suborderId: 'v999frvg-01' }, summary]));

      const order = await interactor.getOne('v95020273frvg-01', 20277852);

      expect(listMock).toHaveBeenCalledWith({ docnumber: 30123456, page: 1, pageSize: 100 });
      expect(order).toMatchObject({ suborderId: 'v95020273frvg-01', source: 'fallback', missing: ['email'] });
    });

    it('throws the original Seller Central error when the suborder is not in the list', async () => {
      sellerCentral.getOne.mockRejectedValue(sellerCentral500);
      vtex.getOrder.mockResolvedValue(vtexOrder);
      sellerCentral.list.mockResolvedValue(listPage([]));

      await expect(interactor.getOne('v95020273frvg-01', 20277852)).rejects.toBe(sellerCentral500);
    });

    it('throws the original error when VTEX has no usable document', async () => {
      sellerCentral.getOne.mockRejectedValue(sellerCentral500);
      vtex.getOrder.mockResolvedValue({ ...vtexOrder, clientProfileData: { document: '' } });

      await expect(interactor.getOne('v95020273frvg-01', 20277852)).rejects.toBe(sellerCentral500);
      expect(listMock).not.toHaveBeenCalled();
    });

    it('throws the original error when the list lookup also fails', async () => {
      sellerCentral.getOne.mockRejectedValue(sellerCentral500);
      vtex.getOrder.mockResolvedValue(vtexOrder);
      sellerCentral.list.mockRejectedValue(new Error('list down'));

      await expect(interactor.getOne('v95020273frvg-01', 20277852)).rejects.toBe(sellerCentral500);
    });
  });
});
