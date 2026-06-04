import { Transaction } from '@domain/order/entities/transaction.entity';
import {
  IORDER_REPOSITORY,
  IOrderRepository,
} from '@domain/order/ports/i-order.repository';
import {
  IPAYPAL_GATEWAY_SERVICE,
  IPayPalGatewayService,
} from '@domain/order/ports/i-paypal-gateway.service';
import {
  ITRANSACTION_REPOSITORY,
  ITransactionRepository,
} from '@domain/order/ports/i-transaction.repository';
import {
  IVNPAY_GATEWAY_SERVICE,
  IVnPayGatewayService,
} from '@domain/order/ports/i-vnpay-gateway.service';
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from '@shared/types/order-status.enum';
import { PaymentMethod } from '@shared/types/payment-method.enum';
import { UniqueId } from '@shared/types/unique-id.vo';

export interface InitiatePaymentDto {
  orderId: string;
  paymentMethod: PaymentMethod;
  ipAddress?: string;
  locale?: 'vn' | 'en';
}

@Injectable()
export class InitiatePaymentUseCase {
  constructor(
    @Inject(IORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
    @Inject(ITRANSACTION_REPOSITORY)
    private readonly transactionRepo: ITransactionRepository,
    @Inject(IVNPAY_GATEWAY_SERVICE)
    private readonly vnpayGateway: IVnPayGatewayService,
    @Inject(IPAYPAL_GATEWAY_SERVICE)
    private readonly paypalGateway: IPayPalGatewayService,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    studentId: string,
    dto: InitiatePaymentDto,
  ): Promise<{ paymentUrl: string; gatewayOrderId?: string; transactionId: string }> {
    const order = await this.orderRepo.findById(new UniqueId(dto.orderId));
    if (!order) {
      throw new NotFoundException(`Order ${dto.orderId} not found`);
    }

    if (order.studentId.value !== studentId) {
      throw new ForbiddenException('You do not own this order');
    }

    if (order.status === OrderStatus.SUCCESS) {
      throw new BadRequestException('Order has already been paid successfully');
    }

    if (dto.paymentMethod === PaymentMethod.FREE) {
      throw new BadRequestException('Free checkout cannot be initiated this way');
    }

    // Set order payment method
    order.markAsPendingPayment(dto.paymentMethod);
    await this.orderRepo.save(order, []); // OrderItems can be empty as we only update order status/metadata

    const transactionId = UniqueId.generate();

    if (dto.paymentMethod === PaymentMethod.PAYPAL) {
      const exchangeRate = this.configService.get<number>('payment.exchangeRate') || 25000;
      const amountUsdNum = order.totalAmount / exchangeRate;
      const amountUsdStr = amountUsdNum.toFixed(2);

      const transaction = Transaction.create(
        {
          userId: order.studentId,
          orderId: order.id,
          paymentMethod: PaymentMethod.PAYPAL,
          amountVnd: order.totalAmount,
          currency: 'USD',
          amount: parseFloat(amountUsdStr),
          exchangeRate,
        },
        transactionId,
      );

      await this.transactionRepo.save(transaction);

      try {
        const { paypalOrderId, approveUrl, rawResponse } = await this.paypalGateway.createOrder({
          orderId: order.id.value,
          transactionId: transactionId.value,
          amountUsd: amountUsdStr,
          currency: 'USD',
        });

        if (!approveUrl) {
          throw new Error('No approval link returned from PayPal');
        }

        transaction.setGatewayOrderId(paypalOrderId);
        transaction.setPaymentUrl(approveUrl);
        // Save raw response log
        transaction.setRawResponse(rawResponse);

        await this.transactionRepo.save(transaction);

        return {
          paymentUrl: approveUrl,
          gatewayOrderId: paypalOrderId,
          transactionId: transactionId.value,
        };
      } catch (err: any) {
        transaction.markAsFailed('PAYPAL_CREATE_ORDER_FAILED', err.message || 'PayPal call failed');
        await this.transactionRepo.save(transaction);
        throw new BadRequestException(`PayPal checkout creation failed: ${err.message}`);
      }
    } else if (dto.paymentMethod === PaymentMethod.VNPAY) {
      const transaction = Transaction.create(
        {
          userId: order.studentId,
          orderId: order.id,
          paymentMethod: PaymentMethod.VNPAY,
          amountVnd: order.totalAmount,
          currency: 'VND',
          amount: order.totalAmount,
        },
        transactionId,
      );

      await this.transactionRepo.save(transaction);

      try {
        const paymentUrl = this.vnpayGateway.createPaymentUrl({
          orderId: order.id.value,
          transactionId: transactionId.value,
          amountVnd: order.totalAmount,
          ipAddress: dto.ipAddress || '127.0.0.1',
          orderInfo: `Pay for order ${order.id.value}`,
          locale: dto.locale || 'vn',
        });

        transaction.setPaymentUrl(paymentUrl);
        await this.transactionRepo.save(transaction);

        return {
          paymentUrl,
          transactionId: transactionId.value,
        };
      } catch (err: any) {
        transaction.markAsFailed('VNPAY_CREATE_URL_FAILED', err.message || 'VNPay call failed');
        await this.transactionRepo.save(transaction);
        throw new BadRequestException(`VNPay checkout creation failed: ${err.message}`);
      }
    }

    throw new BadRequestException('Unsupported payment method');
  }
}
