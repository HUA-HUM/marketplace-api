import { Injectable } from '@nestjs/common';
import { IGetProductPerformanceRepository } from 'src/core/adapters/repositories/google/reports/IGetProductPerformanceRepository';
import { Logger } from 'src/core/drivers/logger/Logger';
import { GoogleProductPerformance } from 'src/core/entities/google/reports/GoogleProductPerformance';
import { GoogleMerchantConfig } from '../config/GoogleMerchantConfig';
import { GoogleMerchantHttpClient } from '../http/GoogleMerchantHttpClient';

interface GoogleReportsSearchResponse {
  results?: Array<{
    productPerformanceView?: {
      offerId?: string;
      title?: string;
      clicks?: string | number;
      impressions?: string | number;
      clickThroughRate?: string | number;
      marketingMethod?: string;
      customerCountryCode?: string;
    };
  }>;
}

@Injectable()
export class GetProductPerformanceRepository implements IGetProductPerformanceRepository {
  constructor(
    private readonly http: GoogleMerchantHttpClient,
    private readonly config: GoogleMerchantConfig
  ) {}

  async getProductPerformance(params: { sku: string; from: string; to: string }): Promise<GoogleProductPerformance> {
    const query = [
      'SELECT offer_id, title, clicks, impressions, click_through_rate, marketing_method, customer_country_code',
      'FROM product_performance_view',
      `WHERE offer_id = '${this.escapeQueryValue(params.sku)}'`,
      `AND date BETWEEN '${params.from}' AND '${params.to}'`
    ].join(' ');

    Logger.info(
      `[GOOGLE MERCHANT] get-product-performance ${JSON.stringify({
        sku: params.sku,
        from: params.from,
        to: params.to
      })}`
    );

    const response = await this.http.post<GoogleReportsSearchResponse>(
      `/reports/v1/accounts/${this.config.accountId}/reports:search`,
      { query }
    );

    const rows = response.results ?? [];

    const performance = rows.reduce<GoogleProductPerformance>(
      (acc, row) => {
        const view = row.productPerformanceView;

        if (!view) {
          return acc;
        }

        acc.clicks += this.toNumber(view.clicks);
        acc.impressions += this.toNumber(view.impressions);
        acc.rows.push(row);
        return acc;
      },
      {
        sku: params.sku,
        from: params.from,
        to: params.to,
        clicks: 0,
        impressions: 0,
        clickThroughRate: 0,
        rows: []
      }
    );

    performance.clickThroughRate =
      performance.impressions > 0 ? Number((performance.clicks / performance.impressions).toFixed(6)) : 0;

    return performance;
  }

  private toNumber(value: string | number | undefined): number {
    if (typeof value === 'number') {
      return value;
    }

    if (!value) {
      return 0;
    }

    return Number(value.replace(/,/g, '')) || 0;
  }

  private escapeQueryValue(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }
}
