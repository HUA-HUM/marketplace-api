export interface IGoogleMerchantAuthRepository {
  getAccessToken(): Promise<string>;
}
