import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { VnPayGatewayService } from './vnpay-gateway.service';

describe('VnPayGatewayService', () => {
  let service: VnPayGatewayService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VnPayGatewayService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'payment.vnpay.tmnCode') return '2QX2XYZ9';
              if (key === 'payment.vnpay.hashSecret') return 'VNPAY_HASH_SECRET_PLACEHOLDER';
              if (key === 'payment.vnpay.url') return 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
              if (key === 'payment.vnpay.returnUrl') return 'http://localhost:3000/checkout/result';
              if (key === 'payment.vnpay.version') return '2.1.0';
              if (key === 'payment.vnpay.currCode') return 'VND';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<VnPayGatewayService>(VnPayGatewayService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPaymentUrl', () => {
    it('should generate a valid payment URL with alphabetic query parameters and a secure hash', () => {
      const url = service.createPaymentUrl({
        orderId: 'order_123',
        transactionId: 'txn_456',
        amountVnd: 50000,
        ipAddress: '127.0.0.1',
        orderInfo: 'Payment for order 123',
        locale: 'vn',
      });

      expect(url).toContain('https://sandbox.vnpayment.vn/paymentv2/vpcpay.html');
      expect(url).toContain('vnp_Version=2.1.0');
      expect(url).toContain('vnp_TxnRef=txn_456');
      expect(url).toContain('vnp_Amount=5000000'); // 50000 * 100
      expect(url).toContain('vnp_SecureHash=');
    });
  });

  describe('verifyParams', () => {
    it('should correctly verify and match valid secure hashes', () => {
      const inputParams = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: '2QX2XYZ9',
        vnp_Amount: '5000000',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: 'txn_456',
        vnp_OrderInfo: 'Payment for order 123',
        vnp_OrderType: 'other',
        vnp_Locale: 'vn',
        vnp_ReturnUrl: 'http://localhost:3000/checkout/result?orderId=order_123',
        vnp_IpAddr: '127.0.0.1',
        vnp_CreateDate: '20260604120000',
      };

      // Construct mock signature
      const sortedKeys = Object.keys(inputParams).sort();
      const signData = sortedKeys
        .map((key) => `${key}=${encodeURIComponent((inputParams as any)[key]).replace(/%20/g, '+')}`)
        .join('&');

      const crypto = require('crypto');
      const expectedHash = crypto
        .createHmac('sha512', 'VNPAY_HASH_SECRET_PLACEHOLDER')
        .update(signData)
        .digest('hex');

      const verifyRes = service.verifyParams({
        ...inputParams,
        vnp_SecureHash: expectedHash,
      });

      expect(verifyRes.isValidSignature).toBe(true);
      expect(verifyRes.txnRef).toBe('txn_456');
      expect(verifyRes.amount).toBe(50000);
    });

    it('should return false for invalid signatures', () => {
      const verifyRes = service.verifyParams({
        vnp_TxnRef: 'txn_123',
        vnp_Amount: '100000',
        vnp_SecureHash: 'invalid_hash_signature',
      });

      expect(verifyRes.isValidSignature).toBe(false);
    });
  });
});
