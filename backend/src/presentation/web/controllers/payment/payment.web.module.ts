import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { PaymentController } from './payment.controller';
import { InitiatePaymentUseCase } from '@application/order/use-cases/initiate-payment.use-case';
import { CapturePayPalPaymentUseCase } from '@application/order/use-cases/capture-paypal-payment.use-case';
import { ProcessVnPayIpnUseCase } from '@application/order/use-cases/process-vnpay-ipn.use-case';
import { GetPaymentStatusUseCase } from '@application/order/use-cases/get-payment-status.use-case';

@Module({
  imports: [InfrastructureModule, ConfigModule],
  controllers: [PaymentController],
  providers: [
    InitiatePaymentUseCase,
    CapturePayPalPaymentUseCase,
    ProcessVnPayIpnUseCase,
    GetPaymentStatusUseCase,
  ],
})
export class PaymentWebModule {}
