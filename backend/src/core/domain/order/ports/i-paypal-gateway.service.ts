export const IPAYPAL_GATEWAY_SERVICE = Symbol('IPayPalGatewayService');

export interface IPayPalGatewayService {
  createOrder(input: {
    orderId: string;
    transactionId: string;
    amountUsd: string;
    currency: 'USD';
  }): Promise<{
    paypalOrderId: string;
    approveUrl?: string;
    rawResponse: unknown;
  }>;

  captureOrder(paypalOrderId: string): Promise<{
    status: string;
    captureId?: string;
    rawResponse: unknown;
  }>;
}
