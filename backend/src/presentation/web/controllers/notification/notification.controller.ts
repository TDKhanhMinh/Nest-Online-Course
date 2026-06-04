import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@presentation/web/shared/decorators/current-user.decorator';
import { GetNotificationsUseCase } from '@application/notification/use-cases/get-notifications.use-case';
import { GetUnreadNotificationCountUseCase } from '@application/notification/use-cases/get-unread-count.use-case';
import { MarkNotificationAsReadUseCase } from '@application/notification/use-cases/mark-notification-as-read.use-case';
import { MarkAllNotificationsAsReadUseCase } from '@application/notification/use-cases/mark-all-notifications-as-read.use-case';
import { SoftDeleteNotificationUseCase } from '@application/notification/use-cases/soft-delete-notification.use-case';
import { RegisterFcmTokenUseCase } from '@application/notification/use-cases/register-fcm-token.use-case';
import { UnregisterFcmTokenUseCase } from '@application/notification/use-cases/unregister-fcm-token.use-case';
import { GetNotificationsDto, RegisterFcmTokenDto, UnregisterFcmTokenDto } from '@application/notification/dto/notification.dto';
import { Request } from 'express';

@Controller({
  path: 'notifications',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly getNotificationsUseCase: GetNotificationsUseCase,
    private readonly getUnreadCountUseCase: GetUnreadNotificationCountUseCase,
    private readonly markAsReadUseCase: MarkNotificationAsReadUseCase,
    private readonly markAllAsReadUseCase: MarkAllNotificationsAsReadUseCase,
    private readonly softDeleteUseCase: SoftDeleteNotificationUseCase,
    private readonly registerFcmTokenUseCase: RegisterFcmTokenUseCase,
    private readonly unregisterFcmTokenUseCase: UnregisterFcmTokenUseCase,
  ) {}

  @Get('unread-count')
  async getMyUnreadCount(@CurrentUser() user: JwtPayload) {
    return this.getUnreadCountUseCase.execute(user.sub);
  }

  @Get()
  async getMyNotifications(@CurrentUser() user: JwtPayload, @Query() query: GetNotificationsDto) {
    return this.getNotificationsUseCase.execute(user.sub, query);
  }

  @Patch('read-all')
  async markAllAsRead(@CurrentUser() user: JwtPayload) {
    await this.markAllAsReadUseCase.execute(user.sub);
    return { success: true };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    await this.markAsReadUseCase.execute(id, user.sub);
    return { success: true };
  }

  @Post('fcm-token')
  async registerFcmToken(
    @CurrentUser() user: JwtPayload,
    @Body() body: RegisterFcmTokenDto,
    @Req() req: Request,
  ) {
    await this.registerFcmTokenUseCase.execute({
      userId: user.sub,
      fcmToken: body.fcmToken,
      deviceId: body.deviceId,
      platform: body.platform ?? 'WEB',
      userAgent: req.headers['user-agent'],
    });
    return { success: true };
  }

  @Delete('fcm-token')
  async unregisterFcmToken(@CurrentUser() user: JwtPayload, @Query() query: UnregisterFcmTokenDto) {
    await this.unregisterFcmTokenUseCase.execute({
      userId: user.sub,
      fcmToken: query.fcmToken,
    });
    return { success: true };
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    await this.softDeleteUseCase.execute(id, user.sub);
    return { success: true };
  }
}
