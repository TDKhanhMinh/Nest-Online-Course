import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import {
  NotificationType,
  NotificationPriority,
  NotificationTargetType,
} from '@domain/notification/types/notification.types';

@Schema({ timestamps: true })
export class NotificationDocument extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  recipientId: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({
    type: String,
    enum: Object.values(NotificationType),
    required: true,
    index: true,
  })
  type: NotificationType;

  @Prop({ type: Boolean, default: false, index: true })
  isRead: boolean;

  @Prop({ type: Date, default: null })
  readAt?: Date;

  @Prop({ type: MongooseSchema.Types.Map, of: MongooseSchema.Types.Mixed })
  payload?: Map<string, any>;

  @Prop({ type: String })
  actionUrl?: string;

  @Prop({ type: String, enum: Object.values(NotificationTargetType) })
  targetType?: NotificationTargetType;

  @Prop({ type: String })
  targetId?: string;

  @Prop({
    type: String,
    enum: Object.values(NotificationPriority),
    default: NotificationPriority.NORMAL,
  })
  priority: NotificationPriority;

  @Prop({ type: String, index: true })
  dedupeKey?: string;

  @Prop({ type: Date, index: true, default: null })
  deletedAt?: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'AdminNotificationCampaign', index: true })
  campaignId?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', index: true })
  senderId?: string;

  @Prop({ type: String, default: 'SYSTEM' })
  source?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(NotificationDocument);

// Compound indexes for optimal queries
NotificationSchema.index({ recipientId: 1, deletedAt: 1, createdAt: -1 });
NotificationSchema.index({ recipientId: 1, isRead: 1, deletedAt: 1, createdAt: -1 });
NotificationSchema.index({ dedupeKey: 1 }, { unique: true, sparse: true });
