import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IVnPayGatewayService } from '@domain/order/ports/i-vnpay-gateway.service';
import * as crypto from 'crypto';

@Injectable()
export class VnPayGatewayService implements IVnPayGatewayService {
  constructor(private readonly configService: ConfigService) {}

  createPaymentUrl(input: {
    orderId: string;
    transactionId: string;
    amountVnd: number;
    ipAddress: string;
    orderInfo: string;
    locale?: 'vn' | 'en';
  }): string {
    const tmnCode = this.configService.get<string>('payment.vnpay.tmnCode');
    const hashSecret = this.configService.get<string>('payment.vnpay.hashSecret');
    const url = this.configService.get<string>('payment.vnpay.url');
    const returnUrl = this.configService.get<string>('payment.vnpay.returnUrl');
    const version = this.configService.get<string>('payment.vnpay.version');
    const currCode = this.configService.get<string>('payment.vnpay.currCode');

    const date = new Date();
    // VNPay expects GMT+7 time
    const gmt7Offset = 7 * 60 * 60 * 1000;
    const gmt7Date = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000 + gmt7Offset);
    const createDate = this.formatDate(gmt7Date);

    const vnpParams: Record<string, string> = {
      vnp_Version: version ?? '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode ?? '',
      vnp_Amount: String(input.amountVnd * 100),
      vnp_CurrCode: currCode ?? 'VND',
      vnp_TxnRef: input.transactionId,
      vnp_OrderInfo: input.orderInfo,
      vnp_OrderType: 'other',
      vnp_Locale: input.locale || 'vn',
      vnp_ReturnUrl: returnUrl ? `${returnUrl}?orderId=${input.orderId}` : '',
      vnp_IpAddr: input.ipAddress || '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    // Sort parameters alphabetically
    const sortedParams = this.sortObject(vnpParams);
    
    // Build query string matching Java URLEncoder '+' spacing representation
    const signData = this.buildQueryString(sortedParams);

    // Compute secure hash
    const secureHash = crypto
      .createHmac('sha512', hashSecret ?? '')
      .update(signData)
      .digest('hex');

    // Build final payment URL
    const queryParams = new URLSearchParams();
    for (const [key, val] of Object.entries(sortedParams)) {
      queryParams.append(key, val);
    }
    queryParams.append('vnp_SecureHash', secureHash);

    return `${url}?${queryParams.toString()}`;
  }

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
  } {
    const hashSecret = this.configService.get<string>('payment.vnpay.hashSecret');
    const secureHash = params['vnp_SecureHash'];

    // Clean params: copy and delete secure hash keys
    const cleanParams = { ...params };
    delete cleanParams['vnp_SecureHash'];
    delete cleanParams['vnp_SecureHashType'];

    // Sort params
    const sortedParams = this.sortObject(cleanParams);

    // Build raw data to compute check hash
    const signData = this.buildQueryString(sortedParams);

    // Compute hash
    const computedHash = crypto
      .createHmac('sha512', hashSecret ?? '')
      .update(signData)
      .digest('hex');

    const isValidSignature = computedHash.toLowerCase() === secureHash?.toLowerCase();

    return {
      isValidSignature,
      txnRef: params['vnp_TxnRef'],
      responseCode: params['vnp_ResponseCode'],
      transactionStatus: params['vnp_TransactionStatus'],
      amount: params['vnp_Amount'] ? parseFloat(params['vnp_Amount']) / 100 : undefined,
      bankCode: params['vnp_BankCode'],
      payDate: params['vnp_PayDate'],
      gatewayTransactionNo: params['vnp_TransactionNo'],
      rawParams: params,
    };
  }

  private formatDate(date: Date): string {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
  }

  private sortObject(obj: Record<string, string>): Record<string, string> {
    const sorted: Record<string, string> = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
        sorted[key] = obj[key];
      }
    }
    return sorted;
  }

  private buildQueryString(obj: Record<string, string>): string {
    return Object.entries(obj)
      .map(([key, val]) => `${key}=${encodeURIComponent(val).replace(/%20/g, '+')}`)
      .join('&');
  }
}
