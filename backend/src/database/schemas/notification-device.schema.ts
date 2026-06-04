import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class NotificationDeviceDocument extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: string;

  @Prop({ type: String, required: true, unique: true })
  fcmToken: string;

  @Prop({ type: String })
  deviceId?: string;

  @Prop({ type: String })
  userAgent?: string;

  @Prop({ type: String, enum: ['WEB', 'ANDROID', 'IOS'], default: 'WEB' })
  platform: 'WEB' | 'ANDROID' | 'IOS';

  @Prop({ type: Boolean, default: true, index: true })
  isActive: boolean;

  @Prop({ type: Date })
  lastUsedAt?: Date;
}

export const NotificationDeviceSchema = SchemaFactory.createForClass(NotificationDeviceDocument);

NotificationDeviceSchema.index({ userId: 1, isActive: 1 });
NotificationDeviceSchema.index({ fcmToken: 1 }, { unique: true });
