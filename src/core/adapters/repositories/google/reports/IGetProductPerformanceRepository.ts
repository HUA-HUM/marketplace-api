import { GoogleProductPerformance } from 'src/core/entities/google/reports/GoogleProductPerformance';

export interface IGetProductPerformanceRepository {
  getProductPerformance(params: { sku: string; from: string; to: string }): Promise<GoogleProductPerformance>;
}
