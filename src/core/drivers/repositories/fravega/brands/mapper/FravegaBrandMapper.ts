import { FravegaBrand } from 'src/core/entities/fravega/brands/FravegaBrand';

export class FravegaBrandMapper {
  static toDomain(data: any): FravegaBrand {
    return new FravegaBrand(data.id, data.name);
  }

  static toDomainList(data: any[]): FravegaBrand[] {
    return data.map(this.toDomain);
  }
}
