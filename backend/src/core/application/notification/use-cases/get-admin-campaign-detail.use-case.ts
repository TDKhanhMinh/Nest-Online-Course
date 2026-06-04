import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository, INOTIFICATION_REPOSITORY } from '@domain/notification/ports/i-notification.repository';

@Injectable()
export class GetAdminCampaignDetailUseCase {
  constructor(
    @Inject(INOTIFICATION_REPOSITORY)
    private readonly notificationRepo: INotificationRepository,
  ) {}

  async execute(campaignId: string): Promise<any> {
    return this.notificationRepo.findCampaignById(campaignId);
  }
}
