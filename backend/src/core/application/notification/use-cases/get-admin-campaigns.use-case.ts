import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository, INOTIFICATION_REPOSITORY } from '@domain/notification/ports/i-notification.repository';

export interface GetAdminCampaignsInput {
  limit: number;
  offset: number;
  keyword?: string;
  targetType?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

@Injectable()
export class GetAdminCampaignsUseCase {
  constructor(
    @Inject(INOTIFICATION_REPOSITORY)
    private readonly notificationRepo: INotificationRepository,
  ) {}

  async execute(input: GetAdminCampaignsInput): Promise<{ campaigns: any[]; total: number }> {
    return this.notificationRepo.findCampaigns(input.limit, input.offset, input);
  }
}
