import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { OrderStatus } from '@shared/types/order-status.enum';
import { PaymentMethod } from '@shared/types/payment-method.enum';

@Schema({ timestamps: true })
export class OrderDocument extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'UserDocument' })
  studentId: string;

  @Prop({ required: true, type: Number })
  totalAmount: number;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ type: String, enum: PaymentMethod, default: null })
  paymentMethod?: PaymentMethod;

  @Prop({ type: Date, default: null })
  paidAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(OrderDocument);
