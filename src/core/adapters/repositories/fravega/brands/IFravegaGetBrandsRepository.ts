import { FravegaBrand } from 'src/core/entities/fravega/brands/FravegaBrand';

export interface IFravegaGetBrandsRepository {
  execute(): Promise<FravegaBrand[]>;
}
