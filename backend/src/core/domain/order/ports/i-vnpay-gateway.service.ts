export const IVNPAY_GATEWAY_SERVICE = Symbol('IVnPayGatewayService');

export interface IVnPayGatewayService {
  createPaymentUrl(input: {
    orderId: string;
    transactionId: string;
    amountVnd: number;
    ipAddress: string;
    orderInfo: string;
    locale?: 'vn' | 'en';
  }): string;

  verifyParams(params: Record<string, string>): {
    isValidSignature: boolean;
    txnRef?: string;
    responseCode?: string;
    transactionStatus?: string;
    amount?: number;
    bankCode?: string;
    payDate?: string;
    gatewayTransactionNo?: string;
    rawParams: Record<string, string>;
  };
}
