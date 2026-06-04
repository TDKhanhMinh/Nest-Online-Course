import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel as InjectModelMongoose } from '@nestjs/mongoose';
import { INotificationDeviceRepository } from '@domain/notification/ports/i-notification-device.repository';
import { NotificationDevice } from '@domain/notification/entities/notification-device.entity';
import { NotificationDeviceDocument } from '@/database/schemas/notification-device.schema';
import { NotificationDeviceMapper } from '../mappers/notification-device.mapper';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class MongooseNotificationDeviceRepository implements INotificationDeviceRepository {
  constructor(
    @InjectModelMongoose(NotificationDeviceDocument.name)
    private readonly model: Model<NotificationDeviceDocument>,
  ) {}

  async save(device: NotificationDevice): Promise<void> {
    const persistence = NotificationDeviceMapper.toPersistence(device);
    await this.model
      .findByIdAndUpdate(device.id.value, persistence, { upsert: true, returnDocument: 'after' })
      .exec();
  }

  async findByFcmToken(fcmToken: string): Promise<NotificationDevice | null> {
    const doc = await this.model.findOne({ fcmToken }).exec();
    return NotificationDeviceMapper.toDomain(doc);
  }

  async findActiveTokensByUserId(userId: UniqueId): Promise<string[]> {
    const docs = await this.model.find({ userId: userId.value, isActive: true }).exec();
    return docs.map((doc) => doc.fcmToken);
  }

  async deactivateTokens(fcmTokens: string[]): Promise<void> {
    await this.model
      .updateMany({ fcmToken: { $in: fcmTokens } }, { $set: { isActive: false } })
      .exec();
  }

  async findByUserAndToken(userId: UniqueId, fcmToken: string): Promise<NotificationDevice | null> {
    const doc = await this.model.findOne({ userId: userId.value, fcmToken }).exec();
    return NotificationDeviceMapper.toDomain(doc);
  }

  async findActiveTokensByUserIds(userIds: string[]): Promise<Array<{ userId: string; token: string }>> {
    const docs = await this.model.find({ userId: { $in: userIds }, isActive: true }).exec();
    return docs.map((doc) => ({
      userId: doc.userId.toString(),
      token: doc.fcmToken,
    }));
  }
}
