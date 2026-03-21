import { FravegaUpdateItemRequest } from 'src/core/entities/fravega/update/FravegaUpdateItemRequest';
import { FravegaUpdatedItem } from 'src/core/entities/fravega/update/FravegaUpdatedItem';

export interface IFravegaUpdateItemByRefIdRepository {
  execute(refId: string, body: FravegaUpdateItemRequest): Promise<FravegaUpdatedItem>;
}
