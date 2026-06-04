import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IPayPalGatewayService } from '@domain/order/ports/i-paypal-gateway.service';

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

@Injectable()
export class PayPalGatewayService implements IPayPalGatewayService {
  private readonly logger = new Logger(PayPalGatewayService.name);
  private tokenCache: TokenCache | null = null;

  constructor(private readonly configService: ConfigService) {}

  async createOrder(input: {
    orderId: string;
    transactionId: string;
    amountUsd: string;
    currency: 'USD';
  }): Promise<{
    paypalOrderId: string;
    approveUrl?: string;
    rawResponse: unknown;
  }> {
    const baseUrl = this.configService.get<string>('payment.paypal.baseUrl');
    const returnUrl = this.configService.get<string>('payment.vnpay.returnUrl') || 'http://localhost:3000/checkout/result';
    
    const accessToken = await this.getAccessToken();

    const body = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: input.transactionId,
          amount: {
            currency_code: input.currency,
            value: input.amountUsd,
          },
          custom_id: input.orderId,
        },
      ],
      application_context: {
        brand_name: 'Online Course Academy',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: returnUrl,
        cancel_url: returnUrl,
      },
    };

    const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(body),
    });

    const resBody = await response.json();
    if (!response.ok) {
      this.logger.error(`PayPal Create Order Error: ${JSON.stringify(resBody)}`);
      throw new Error(`PayPal Create Order Failed: ${resBody.message || 'Unknown error'}`);
    }

    const approveUrl = resBody.links?.find((link: any) => link.rel === 'approve')?.href;

    return {
      paypalOrderId: resBody.id,
      approveUrl,
      rawResponse: resBody,
    };
  }

  async captureOrder(paypalOrderId: string): Promise<{
    status: string;
    captureId?: string;
    rawResponse: unknown;
  }> {
    const baseUrl = this.configService.get<string>('payment.paypal.baseUrl');
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': paypalOrderId, // Idempotency
      },
      body: JSON.stringify({}),
    });

    const resBody = await response.json();
    if (!response.ok) {
      this.logger.error(`PayPal Capture Error: ${JSON.stringify(resBody)}`);
      throw new Error(`PayPal Capture Failed: ${resBody.message || 'Unknown error'}`);
    }

    const captureId = resBody.purchase_units?.[0]?.payments?.captures?.[0]?.id;

    return {
      status: resBody.status,
      captureId,
      rawResponse: resBody,
    };
  }

  private async getAccessToken(): Promise<string> {
    // Check if token exists and is valid (with 60-second buffer)
    const now = Date.now();
    if (this.tokenCache && this.tokenCache.expiresAt > now + 60000) {
      return this.tokenCache.accessToken;
    }

    const clientId = this.configService.get<string>('payment.paypal.clientId');
    const clientSecret = this.configService.get<string>('payment.paypal.clientSecret');
    const baseUrl = this.configService.get<string>('payment.paypal.baseUrl');

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const resBody = await response.json();
    if (!response.ok) {
      this.logger.error(`PayPal Auth Error: ${JSON.stringify(resBody)}`);
      throw new Error(`PayPal Authentication Failed: ${resBody.error_description || 'Unknown error'}`);
    }

    this.tokenCache = {
      accessToken: resBody.access_token,
      expiresAt: now + resBody.expires_in * 1000,
    };

    return this.tokenCache.accessToken;
  }
}
