import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TransactionStatus } from '@shared/types/transaction-status.enum';
import { PaymentMethod } from '@shared/types/payment-method.enum';

@Schema({ timestamps: true })
export class TransactionDocument extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User', index: true })
  userId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Order', index: true })
  orderId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', default: null })
  courseId?: string;

  @Prop({ required: true, type: String, enum: PaymentMethod, index: true })
  paymentMethod: PaymentMethod;

  @Prop({ required: true, type: String, enum: TransactionStatus, default: TransactionStatus.PENDING, index: true })
  status: TransactionStatus;

  @Prop({ required: true, type: Number })
  amountVnd: number;

  @Prop({ required: true, type: String, enum: ['VND', 'USD'] })
  currency: 'VND' | 'USD';

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ type: Number })
  exchangeRate?: number;

  @Prop({ type: String, index: true })
  gatewayOrderId?: string;

  @Prop({ type: String, index: true })
  gatewayTransactionNo?: string;

  @Prop({ type: String })
  gatewayResponseCode?: string;

  @Prop({ type: String })
  gatewayMessage?: string;

  @Prop({ type: String })
  paymentUrl?: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  rawRequest?: any;

  @Prop({ type: MongooseSchema.Types.Mixed })
  rawResponse?: any;

  @Prop({ type: Date })
  paidAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(TransactionDocument);
