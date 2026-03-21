import { FravegaUpdateItemRequest } from 'src/core/entities/fravega/update/FravegaUpdateItemRequest';
import { FravegaUpdatedItem } from 'src/core/entities/fravega/update/FravegaUpdatedItem';

export interface IFravegaUpdateItemByIdRepository {
  execute(id: string, body: FravegaUpdateItemRequest): Promise<FravegaUpdatedItem>;
}
