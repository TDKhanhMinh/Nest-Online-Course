import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class AdminNotificationCampaignDocument extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  senderId: string;

  @Prop({ type: String })
  senderEmail?: string;

  @Prop({ type: String, enum: ['ALL', 'USER'], required: true })
  targetType: 'ALL' | 'USER';

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null, index: true })
  recipientId?: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String })
  actionUrl?: string;

  @Prop({ type: String, default: 'NORMAL' })
  priority: string; // LOW | NORMAL | HIGH

  @Prop({ type: Number, default: 0 })
  totalRecipients: number;

  @Prop({ type: Number, default: 0 })
  totalTokens: number;

  @Prop({ type: Number, default: 0 })
  inAppCreatedCount: number;

  @Prop({ type: Number, default: 0 })
  pushSuccessCount: number;

  @Prop({ type: Number, default: 0 })
  pushFailureCount: number;

  @Prop({ type: String, enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'PARTIAL_FAILED', 'FAILED'], default: 'PENDING' })
  status: string;

  @Prop({ type: String })
  errorSummary?: string;

  @Prop({ type: String, index: true })
  requestId?: string; // Idempotency key from client
}

export const AdminNotificationCampaignSchema = SchemaFactory.createForClass(AdminNotificationCampaignDocument);
AdminNotificationCampaignSchema.index({ senderId: 1, requestId: 1 }, { unique: true, sparse: true });
