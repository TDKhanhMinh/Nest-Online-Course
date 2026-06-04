import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';
import { RolesGuard } from '@presentation/web/shared/guards/roles.guard';
import { Roles } from '@presentation/web/shared/decorators/roles.decorator';
import { Role } from '@shared/types/role.enum';
import { CurrentUser, JwtPayload } from '@presentation/web/shared/decorators/current-user.decorator';
import { AdminSendNotificationDto } from '@application/notification/dto/notification.dto';
import { AdminSendNotificationUseCase } from '@application/notification/use-cases/admin-send-notification.use-case';
import { GetAdminCampaignsUseCase } from '@application/notification/use-cases/get-admin-campaigns.use-case';
import { GetAdminCampaignDetailUseCase } from '@application/notification/use-cases/get-admin-campaign-detail.use-case';

@Controller({
  path: 'admin/notifications',
  version: '1',
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminNotificationController {
  constructor(
    private readonly adminSendNotificationUseCase: AdminSendNotificationUseCase,
    private readonly getAdminCampaignsUseCase: GetAdminCampaignsUseCase,
    private readonly getAdminCampaignDetailUseCase: GetAdminCampaignDetailUseCase,
  ) {}

  @Post()
  async sendNotification(
    @Body() dto: AdminSendNotificationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.adminSendNotificationUseCase.execute({
      senderId: user.sub,
      senderEmail: user.email,
      targetType: dto.targetType,
      recipientId: dto.recipientId,
      title: dto.title,
      content: dto.content,
      actionUrl: dto.actionUrl,
      priority: dto.priority,
      requestId: dto.requestId,
    });
    return result;
  }

  @Get()
  async getCampaigns(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('keyword') keyword?: string,
    @Query('targetType') targetType?: string,
    @Query('status') status?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    const p = Math.max(1, parseInt(page, 10));
    const l = Math.max(1, parseInt(limit, 10));
    const offset = (p - 1) * l;
    const { campaigns, total } = await this.getAdminCampaignsUseCase.execute({
      limit: l,
      offset,
      keyword,
      targetType,
      status,
      fromDate,
      toDate,
    });
    return {
      items: campaigns,
      total,
      page: p,
      limit: l,
    };
  }

  @Get(':campaignId')
  async getCampaignDetail(@Param('campaignId') campaignId: string) {
    const campaign = await this.getAdminCampaignDetailUseCase.execute(campaignId);
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }
    return campaign;
  }
}
