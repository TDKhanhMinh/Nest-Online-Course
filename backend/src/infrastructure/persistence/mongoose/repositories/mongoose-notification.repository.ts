import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { INotificationRepository } from '@domain/notification/ports/i-notification.repository';
import { Notification } from '@domain/notification/entities/notification.entity';
import { NotificationDocument } from '@/database/schemas/notification.schema';
import { NotificationMapper } from '../mappers/notification.mapper';
import { UniqueId } from '@shared/types/unique-id.vo';
import { InjectModel as InjectModelMongoose } from '@nestjs/mongoose';
import { AdminNotificationCampaignDocument } from '@/database/schemas/admin-notification-campaign.schema';

@Injectable()
export class MongooseNotificationRepository implements INotificationRepository {
  constructor(
    @InjectModelMongoose(NotificationDocument.name)
    private readonly model: Model<NotificationDocument>,
    @InjectModelMongoose(AdminNotificationCampaignDocument.name)
    private readonly campaignModel: Model<AdminNotificationCampaignDocument>,
  ) {}

  async findByIdAndRecipient(id: UniqueId, recipientId: UniqueId): Promise<Notification | null> {
    const doc = await this.model
      .findOne({
        _id: id.value,
        recipientId: recipientId.value,
        deletedAt: null,
      })
      .exec();
    return NotificationMapper.toDomain(doc);
  }

  async findByRecipient(
    recipientId: UniqueId,
    limit: number,
    offset: number,
  ): Promise<{ notifications: Notification[]; total: number }> {
    const [docs, total] = await Promise.all([
      this.model
        .find({ recipientId: recipientId.value, deletedAt: null })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .exec(),
      this.model.countDocuments({ recipientId: recipientId.value, deletedAt: null }).exec(),
    ]);

    return {
      notifications: docs.map((doc) => NotificationMapper.toDomain(doc)),
      total,
    };
  }

  async countUnread(recipientId: UniqueId): Promise<number> {
    return this.model
      .countDocuments({
        recipientId: recipientId.value,
        isRead: false,
        deletedAt: null,
      })
      .exec();
  }

  async save(notification: Notification): Promise<void> {
    const persistence = NotificationMapper.toPersistence(notification);
    await this.model
      .findByIdAndUpdate(notification.id.value, persistence, { upsert: true, returnDocument: 'after' })
      .exec();
  }

  async markAllAsRead(recipientId: UniqueId): Promise<void> {
    await this.model
      .updateMany(
        { recipientId: recipientId.value, isRead: false, deletedAt: null },
        { $set: { isRead: true, readAt: new Date() } },
      )
      .exec();
  }

  async softDeleteByRecipient(id: UniqueId, recipientId: UniqueId): Promise<void> {
    await this.model
      .updateOne(
        { _id: id.value, recipientId: recipientId.value, deletedAt: null },
        { $set: { deletedAt: new Date() } },
      )
      .exec();
  }

  async findByDedupeKey(dedupeKey: string): Promise<Notification | null> {
    const doc = await this.model.findOne({ dedupeKey, deletedAt: null }).exec();
    return NotificationMapper.toDomain(doc);
  }

  async saveCampaign(campaign: any): Promise<any> {
    const id = campaign._id || campaign.id;
    if (id) {
      const data = { ...campaign };
      delete data.id;
      delete data._id;
      return this.campaignModel.findByIdAndUpdate(id, data, { returnDocument: 'after' }).exec();
    } else {
      const doc = new this.campaignModel(campaign);
      return doc.save();
    }
  }

  async findCampaignById(id: string): Promise<any> {
    return this.campaignModel.findById(id).exec();
  }

  async findCampaigns(limit: number, offset: number, filter: any = {}): Promise<{ campaigns: any[]; total: number }> {
    const query: any = {};
    if (filter.keyword) {
      query.$or = [
        { title: { $regex: filter.keyword, $options: 'i' } },
        { content: { $regex: filter.keyword, $options: 'i' } },
      ];
    }
    if (filter.targetType) {
      query.targetType = filter.targetType;
    }
    if (filter.status) {
      query.status = filter.status;
    }
    if (filter.fromDate || filter.toDate) {
      query.createdAt = {};
      if (filter.fromDate) {
        query.createdAt.$gte = new Date(filter.fromDate);
      }
      if (filter.toDate) {
        query.createdAt.$lte = new Date(filter.toDate);
      }
    }

    const [docs, total] = await Promise.all([
      this.campaignModel.find(query).sort({ createdAt: -1 }).skip(offset).limit(limit).exec(),
      this.campaignModel.countDocuments(query).exec(),
    ]);

    return { campaigns: docs, total };
  }

  async bulkSaveNotifications(notifications: Notification[]): Promise<void> {
    if (notifications.length === 0) return;
    const ops = notifications.map((n) => {
      const persistence = NotificationMapper.toPersistence(n);
      return {
        updateOne: {
          filter: { _id: persistence._id },
          update: { $set: persistence },
          upsert: true,
        },
      };
    });

    await this.model.bulkWrite(ops, { ordered: false });
  }
}
