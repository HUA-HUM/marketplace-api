import { Inject, Injectable } from '@nestjs/common';
import { IGetProductPerformanceRepository } from 'src/core/adapters/repositories/google/reports/IGetProductPerformanceRepository';
import { GoogleProductPerformance } from 'src/core/entities/google/reports/GoogleProductPerformance';

@Injectable()
export class GetGoogleProductPerformanceService {
  constructor(
    @Inject('IGetProductPerformanceRepository')
    private readonly getProductPerformanceRepository: IGetProductPerformanceRepository
  ) {}

  execute(params: { sku: string; from?: string; to?: string }): Promise<GoogleProductPerformance> {
    const to = params.to ?? this.formatDate(new Date());
    const from = params.from ?? this.daysAgo(30);

    return this.getProductPerformanceRepository.getProductPerformance({
      sku: params.sku,
      from,
      to
    });
  }

  private daysAgo(days: number): string {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - days);
    return this.formatDate(date);
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
