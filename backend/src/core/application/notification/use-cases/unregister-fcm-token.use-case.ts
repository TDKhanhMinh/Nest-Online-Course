import { Inject, Injectable } from '@nestjs/common';
import { INotificationDeviceRepository, INOTIFICATION_DEVICE_REPOSITORY } from '@domain/notification/ports/i-notification-device.repository';
import { UniqueId } from '@shared/types/unique-id.vo';

export interface UnregisterFcmTokenInput {
  userId: string;
  fcmToken: string;
}

@Injectable()
export class UnregisterFcmTokenUseCase {
  constructor(
    @Inject(INOTIFICATION_DEVICE_REPOSITORY)
    private readonly deviceRepo: INotificationDeviceRepository,
  ) {}

  async execute(input: UnregisterFcmTokenInput): Promise<void> {
    const userIdObj = new UniqueId(input.userId);
    const device = await this.deviceRepo.findByUserAndToken(userIdObj, input.fcmToken);

    if (device) {
      device.deactivate();
      await this.deviceRepo.save(device);
    }
  }
}
