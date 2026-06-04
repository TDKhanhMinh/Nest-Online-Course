import { registerAs } from '@nestjs/config';

export default registerAs('payment', () => ({
  expireMinutes: parseInt(process.env.PAYMENT_EXPIRE_MINUTES ?? '15', 10),
  exchangeRate: parseFloat(process.env.USD_VND_EXCHANGE_RATE ?? '25000'),
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID ?? '',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET ?? '',
    baseUrl: process.env.PAYPAL_BASE_URL ?? 'https://api-m.sandbox.paypal.com',
    currency: process.env.PAYPAL_CURRENCY ?? 'USD',
  },
  vnpay: {
    tmnCode: process.env.VNPAY_TMN_CODE ?? '',
    hashSecret: process.env.VNPAY_HASH_SECRET ?? '',
    url: process.env.VNPAY_URL ?? 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    returnUrl: process.env.VNPAY_RETURN_URL ?? 'http://localhost:3000/checkout/result',
    ipnUrl: process.env.VNPAY_IPN_URL ?? 'http://localhost:5000/api/v1/payments/vnpay-ipn',
    version: process.env.VNPAY_VERSION ?? '2.1.0',
    currCode: process.env.VNPAY_CURR_CODE ?? 'VND',
    locale: process.env.VNPAY_LOCALE ?? 'vn',
  },
}));
