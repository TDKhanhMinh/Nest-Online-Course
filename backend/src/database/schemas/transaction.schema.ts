import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { TransactionStatus } from '@/common/types/transaction-status.enum';

@Schema({ timestamps: true })
export class TransactionDocument extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'UserDocument' })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'CourseDocument', default: null })
  courseId?: string;

  @Prop({ type: Types.Decimal128, required: true })
  amount: Types.Decimal128;

  @Prop({ required: true })
  provider: string; // VNPAY, Stripe, Momo...

  @Prop({ required: true, unique: true })
  transactionId: string; // Mã GD từ cổng thanh toán

  @Prop({ type: String, enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;
}

export const TransactionSchema = SchemaFactory.createForClass(TransactionDocument);
