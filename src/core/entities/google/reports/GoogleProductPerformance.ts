export interface GoogleProductPerformance {
  sku: string;
  from: string;
  to: string;
  clicks: number;
  impressions: number;
  clickThroughRate: number;
  rows: unknown[];
}
