import {
  GoogleMerchantProductPublicationStatus,
  GoogleMerchantPublicationIssue,
  GoogleMerchantPublicationStatus
} from 'src/core/entities/google/products/GoogleMerchantProductPublicationStatus';

interface GoogleMerchantDestinationStatus {
  reportingContext?: string;
  approvedCountries?: string[];
  disapprovedCountries?: string[];
  pendingCountries?: string[];
}

interface GoogleMerchantProductStatusPayload {
  destinationStatuses?: GoogleMerchantDestinationStatus[];
  itemLevelIssues?: GoogleMerchantPublicationIssue[];
}

interface GoogleMerchantProductPayload {
  productStatus?: GoogleMerchantProductStatusPayload;
}

export class GoogleMerchantStatusMapper {
  static appendPublicationStatus<T extends GoogleMerchantProductPayload>(
    product: T,
    options: { targetCountry: string; targetContexts: string[] }
  ): T & { marketplaceStatus: GoogleMerchantProductPublicationStatus } {
    return {
      ...product,
      marketplaceStatus: this.toPublicationStatus(product, options)
    };
  }

  static toPublicationStatus(
    product: GoogleMerchantProductPayload,
    options: { targetCountry: string; targetContexts: string[] }
  ): GoogleMerchantProductPublicationStatus {
    const destinationStatuses = product.productStatus?.destinationStatuses ?? [];
    const targetStatuses = destinationStatuses.filter((status) =>
      options.targetContexts.includes(status.reportingContext ?? '')
    );

    const approvedContexts = targetStatuses
      .filter((status) => this.includesCountry(status.approvedCountries, options.targetCountry))
      .map((status) => status.reportingContext)
      .filter((status): status is string => Boolean(status));

    const disapprovedContexts = targetStatuses
      .filter((status) => this.includesCountry(status.disapprovedCountries, options.targetCountry))
      .map((status) => status.reportingContext)
      .filter((status): status is string => Boolean(status));

    const pendingContexts = targetStatuses
      .filter((status) => this.includesCountry(status.pendingCountries, options.targetCountry))
      .map((status) => status.reportingContext)
      .filter((status): status is string => Boolean(status));

    const targetIssues = (product.productStatus?.itemLevelIssues ?? []).filter(
      (issue) =>
        this.appliesToCountry(issue, options.targetCountry) &&
        this.appliesToContext(issue, options.targetContexts)
    );

    const blockingIssues = targetIssues.filter((issue) => issue.severity === 'DISAPPROVED');
    const warnings = targetIssues.filter((issue) => issue.severity !== 'DISAPPROVED');

    return {
      targetCountry: options.targetCountry,
      targetContexts: options.targetContexts,
      status: this.toStatus({ approvedContexts, disapprovedContexts, pendingContexts, blockingIssues }),
      approvedContexts,
      disapprovedContexts,
      pendingContexts,
      blockingIssues,
      warnings
    };
  }

  private static toStatus(params: {
    approvedContexts: string[];
    disapprovedContexts: string[];
    pendingContexts: string[];
    blockingIssues: GoogleMerchantPublicationIssue[];
  }): GoogleMerchantPublicationStatus {
    if (params.approvedContexts.length > 0) {
      return 'ACTIVE';
    }

    if (params.disapprovedContexts.length > 0 || params.blockingIssues.length > 0) {
      return 'ERROR';
    }

    if (params.pendingContexts.length > 0) {
      return 'PENDING';
    }

    return 'PENDING';
  }

  private static appliesToCountry(issue: GoogleMerchantPublicationIssue, targetCountry: string): boolean {
    if (!issue.applicableCountries?.length) {
      return true;
    }

    return this.includesCountry(issue.applicableCountries, targetCountry);
  }

  private static appliesToContext(issue: GoogleMerchantPublicationIssue, targetContexts: string[]): boolean {
    if (!issue.reportingContext) {
      return true;
    }

    return targetContexts.includes(issue.reportingContext);
  }

  private static includesCountry(countries: string[] | undefined, targetCountry: string): boolean {
    return (countries ?? []).some((country) => country.toUpperCase() === targetCountry.toUpperCase());
  }
}
