import { Inject, Injectable } from '@nestjs/common';
import { INotificationDeviceRepository, INOTIFICATION_DEVICE_REPOSITORY } from '@domain/notification/ports/i-notification-device.repository';
import { NotificationDevice } from '@domain/notification/entities/notification-device.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

export interface RegisterFcmTokenInput {
  userId: string;
  fcmToken: string;
  deviceId?: string;
  platform?: 'WEB' | 'ANDROID' | 'IOS';
  userAgent?: string;
}

@Injectable()
export class RegisterFcmTokenUseCase {
  constructor(
    @Inject(INOTIFICATION_DEVICE_REPOSITORY)
    private readonly deviceRepo: INotificationDeviceRepository,
  ) {}

  async execute(input: RegisterFcmTokenInput): Promise<void> {
    const userIdObj = new UniqueId(input.userId);
    const existing = await this.deviceRepo.findByFcmToken(input.fcmToken);

    if (existing) {
      const deviceProps = existing.props;
      deviceProps.userId = userIdObj;
      deviceProps.isActive = true;
      deviceProps.deviceId = input.deviceId ?? deviceProps.deviceId;
      deviceProps.platform = input.platform ?? deviceProps.platform;
      deviceProps.userAgent = input.userAgent ?? deviceProps.userAgent;
      deviceProps.lastUsedAt = new Date();
      await this.deviceRepo.save(existing);
      return;
    }

    const device = NotificationDevice.create({
      userId: userIdObj,
      fcmToken: input.fcmToken,
      deviceId: input.deviceId,
      platform: input.platform ?? 'WEB',
      userAgent: input.userAgent,
      isActive: true,
      lastUsedAt: new Date(),
    });

    await this.deviceRepo.save(device);
  }
}
