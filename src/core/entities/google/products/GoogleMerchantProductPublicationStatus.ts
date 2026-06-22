export type GoogleMerchantPublicationStatus = 'ACTIVE' | 'ERROR' | 'PENDING';

export interface GoogleMerchantPublicationIssue {
  code?: string;
  severity?: string;
  attribute?: string;
  reportingContext?: string;
  description?: string;
  detail?: string;
  applicableCountries?: string[];
}

export interface GoogleMerchantProductPublicationStatus {
  targetCountry: string;
  targetContexts: string[];
  status: GoogleMerchantPublicationStatus;
  approvedContexts: string[];
  disapprovedContexts: string[];
  pendingContexts: string[];
  blockingIssues: GoogleMerchantPublicationIssue[];
  warnings: GoogleMerchantPublicationIssue[];
}
