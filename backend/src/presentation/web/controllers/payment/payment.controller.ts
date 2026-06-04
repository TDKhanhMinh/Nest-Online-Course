import { Controller, Post, Get, Body, Param, Query, UseGuards, Ip, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@presentation/web/shared/decorators/current-user.decorator';
import { InitiatePaymentUseCase, InitiatePaymentDto } from '@application/order/use-cases/initiate-payment.use-case';
import { CapturePayPalPaymentUseCase, CapturePayPalPaymentDto } from '@application/order/use-cases/capture-paypal-payment.use-case';
import { ProcessVnPayIpnUseCase } from '@application/order/use-cases/process-vnpay-ipn.use-case';
import { GetPaymentStatusUseCase } from '@application/order/use-cases/get-payment-status.use-case';

@Controller({
  path: 'payments',
  version: '1',
})
export class PaymentController {
  constructor(
    private readonly initiatePaymentUseCase: InitiatePaymentUseCase,
    private readonly capturePayPalPaymentUseCase: CapturePayPalPaymentUseCase,
    private readonly processVnPayIpnUseCase: ProcessVnPayIpnUseCase,
    private readonly getPaymentStatusUseCase: GetPaymentStatusUseCase,
  ) {}

  @Post('initiate')
  @UseGuards(JwtAuthGuard)
  async initiate(
    @CurrentUser() user: JwtPayload,
    @Body() dto: InitiatePaymentDto,
    @Ip() ip: string,
    @Req() req: Request,
  ) {
    // If behind proxy like Cloudflare, check x-forwarded-for header
    const ipAddress = (req.headers['x-forwarded-for'] as string) || ip || '127.0.0.1';
    return this.initiatePaymentUseCase.execute(user.sub, {
      ...dto,
      ipAddress: ipAddress.split(',')[0].trim(),
    });
  }

  @Post('paypal-capture')
  @UseGuards(JwtAuthGuard)
  async capturePayPal(@CurrentUser() user: JwtPayload, @Body() dto: CapturePayPalPaymentDto) {
    return this.capturePayPalPaymentUseCase.execute(user.sub, dto);
  }

  @Get('vnpay-ipn')
  async handleVnPayIpn(@Query() query: Record<string, string>) {
    return this.processVnPayIpnUseCase.execute(query);
  }

  @Get('status/:orderId')
  @UseGuards(JwtAuthGuard)
  async getPaymentStatus(@CurrentUser() user: JwtPayload, @Param('orderId') orderId: string) {
    return this.getPaymentStatusUseCase.execute(user.sub, orderId);
  }
}
