import { MegatoneProductsRepository } from './MegatoneProductsRepository';
import { MegatoneProductDto } from 'src/core/entities/megatone/products/get/dto/MegatoneProductDto';

describe('MegatoneProductsRepository', () => {
  beforeEach(() => {
    process.env.MEGATONE_SELLER_ID = '389';
  });

  const makeProduct = (id: number): MegatoneProductDto =>
    ({
      IdPublicacion: id,
      SkuSeller: `SKU-${id}`
    }) as MegatoneProductDto;

  const makeResponse = (startId: number) => ({
    Page: 1,
    PageSize: 10,
    Total: 100,
    TotalPages: 10,
    Content: Array.from({ length: 10 }, (_, index) => makeProduct(startId + index))
  });

  const createRepository = () => {
    const http = {
      get: jest.fn(async (_url: string, config: { params: { Pagina: number } }) => {
        const pages: Record<number, ReturnType<typeof makeResponse>> = {
          1: makeResponse(1),
          3: makeResponse(11),
          4: makeResponse(21),
          6: makeResponse(31)
        };

        return pages[config.params.Pagina] ?? {
          Page: config.params.Pagina,
          PageSize: 10,
          Total: 0,
          TotalPages: 0,
          Content: []
        };
      })
    };

    return {
      repository: new MegatoneProductsRepository(http as never),
      http
    };
  };

  it('uses 1-based offsets and skips Megatone empty physical pages when requesting later offsets', async () => {
    const { repository, http } = createRepository();

    const result = await repository.listIds({ offset: 31, limit: 10 });

    expect(result.items).toHaveLength(10);
    expect(result.items[0]).toEqual({ publicationId: 31, sellerSku: 'SKU-31' });
    expect(result.total).toBe(100);
    expect(result.offset).toBe(31);
    expect(result.nextOffset).toBe(41);
    expect(http.get).toHaveBeenCalledWith(
      '/api/MarketplaceCore/Publicaciones',
      expect.objectContaining({
        params: expect.objectContaining({
          Pagina: 6,
          Cantidad: 10
        })
      })
    );
  });

  it('returns disjoint batches using nextOffset', async () => {
    const { repository } = createRepository();

    const firstPage = await repository.listIds({ offset: 1, limit: 10 });
    const secondPage = await repository.listIds({ offset: firstPage.nextOffset!, limit: 10 });
    const thirdPage = await repository.listIds({ offset: secondPage.nextOffset!, limit: 10 });

    expect(firstPage.items.map(item => item.publicationId)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(firstPage.nextOffset).toBe(11);
    expect(secondPage.items.map(item => item.publicationId)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    expect(secondPage.nextOffset).toBe(21);
    expect(thirdPage.items.map(item => item.publicationId)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
    expect(thirdPage.nextOffset).toBe(31);
  });
});
