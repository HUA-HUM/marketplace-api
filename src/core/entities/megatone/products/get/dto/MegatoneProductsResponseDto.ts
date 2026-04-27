import { MegatoneProductDto } from './MegatoneProductDto';

export interface MegatoneGetProductsResponseDto {
  Page: number;
  PageSize: number;
  Total: number;
  TotalPages: number;
  Content: MegatoneProductDto[] | null;
}
