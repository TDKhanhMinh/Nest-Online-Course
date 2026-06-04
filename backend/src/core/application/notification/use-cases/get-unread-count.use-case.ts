import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository, INOTIFICATION_REPOSITORY } from '@domain/notification/ports/i-notification.repository';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class GetUnreadNotificationCountUseCase {
  constructor(
    @Inject(INOTIFICATION_REPOSITORY)
    private readonly notificationRepo: INotificationRepository,
  ) {}

  async execute(recipientId: string): Promise<{ count: number }> {
    const count = await this.notificationRepo.countUnread(new UniqueId(recipientId));
    return { count };
  }
}
