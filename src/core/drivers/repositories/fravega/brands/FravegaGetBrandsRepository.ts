import { Injectable } from '@nestjs/common';
import { FravegaBrand } from 'src/core/entities/fravega/brands/FravegaBrand';
import { FravegaBrandMapper } from './mapper/FravegaBrandMapper';
import { FravegaHttpClient } from '../http/FravegaHttpClient';
import { IFravegaGetBrandsRepository } from 'src/core/adapters/repositories/fravega/brands/IFravegaGetBrandsRepository';

@Injectable()
export class FravegaGetBrandsRepository implements IFravegaGetBrandsRepository {
  constructor(private readonly http: FravegaHttpClient) {}

  async execute(): Promise<FravegaBrand[]> {
    const response = await this.http.get<any[]>('/api/v1/brand');

    return FravegaBrandMapper.toDomainList(response);
  }
}
