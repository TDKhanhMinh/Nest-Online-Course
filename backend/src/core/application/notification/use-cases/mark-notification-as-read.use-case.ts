import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { INotificationRepository, INOTIFICATION_REPOSITORY } from '@domain/notification/ports/i-notification.repository';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class MarkNotificationAsReadUseCase {
  constructor(
    @Inject(INOTIFICATION_REPOSITORY)
    private readonly notificationRepo: INotificationRepository,
  ) {}

  async execute(id: string, recipientId: string): Promise<void> {
    const notification = await this.notificationRepo.findByIdAndRecipient(
      new UniqueId(id),
      new UniqueId(recipientId),
    );

    if (!notification) {
      throw new NotFoundException('Notification not found or access denied');
    }

    notification.markAsRead();
    await this.notificationRepo.save(notification);
  }
}
