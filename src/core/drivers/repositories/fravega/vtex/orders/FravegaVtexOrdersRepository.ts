import { Injectable } from '@nestjs/common';
import { IFravegaVtexOrdersRepository } from 'src/core/adapters/repositories/fravega/vtex/orders/IFravegaVtexOrdersRepository';
import { FravegaVtexOrder } from 'src/core/entities/fravega/vtex/orders/FravegaVtexOrder';
import {
  FravegaVtexInvoiceSummary,
  FravegaVtexOrderInvoicing
} from 'src/core/entities/fravega/vtex/orders/FravegaVtexOrderInvoicing';
import { FravegaVtexHttpClient } from '../http/FravegaVtexHttpClient';

interface VtexOrderPackage {
  invoiceNumber?: string;
  invoiceValue?: number;
  invoiceUrl?: string;
  issuanceDate?: string;
  invoiceKey?: string;
  type?: string;
  trackingNumber?: string;
  courier?: string;
  embeddedInvoice?: string;
}

@Injectable()
export class FravegaVtexOrdersRepository implements IFravegaVtexOrdersRepository {
  constructor(private readonly http: FravegaVtexHttpClient) {}

  async listOrders(params?: Record<string, string>): Promise<unknown> {
    return this.http.get('/api/oms/pvt/orders', params);
  }

  async getOrder(orderId: string): Promise<FravegaVtexOrder> {
    return this.http.get<FravegaVtexOrder>(`/api/oms/pvt/orders/${encodeURIComponent(orderId)}`);
  }

  async getInvoicing(orderId: string): Promise<FravegaVtexOrderInvoicing> {
    const order = await this.getOrder(orderId);
    return this.toInvoicing(order);
  }

  private toInvoicing(order: FravegaVtexOrder): FravegaVtexOrderInvoicing {
    const packages = this.getPackages(order);

    return {
      orderId: this.asString(order.orderId),
      sequence: this.asString(order.sequence),
      status: this.asString(order.status),
      value: this.asNumber(order.value),
      creationDate: this.asString(order.creationDate),
      invoiceData: order.invoiceData,
      packageAttachment: order.packageAttachment,
      paymentData: order.paymentData,
      clientProfileData: order.clientProfileData,
      shippingData: order.shippingData,
      invoices: packages.map((item) => this.toInvoiceSummary(item))
    };
  }

  private getPackages(order: FravegaVtexOrder): VtexOrderPackage[] {
    const packageAttachment = order.packageAttachment;

    if (!this.isRecord(packageAttachment) || !Array.isArray(packageAttachment.packages)) {
      return [];
    }

    return packageAttachment.packages.filter(this.isRecord).map((item) => item as VtexOrderPackage);
  }

  private toInvoiceSummary(item: VtexOrderPackage): FravegaVtexInvoiceSummary {
    return {
      invoiceNumber: this.asString(item.invoiceNumber),
      invoiceValue: this.asNumber(item.invoiceValue),
      invoiceUrl: this.asString(item.invoiceUrl),
      issuanceDate: this.asString(item.issuanceDate),
      invoiceKey: this.asString(item.invoiceKey),
      type: this.asString(item.type),
      trackingNumber: this.asString(item.trackingNumber),
      courier: this.asString(item.courier),
      embeddedInvoice: this.asString(item.embeddedInvoice)
    };
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private asString(value: unknown): string | undefined {
    return typeof value === 'string' ? value : undefined;
  }

  private asNumber(value: unknown): number | undefined {
    return typeof value === 'number' ? value : undefined;
  }
}
