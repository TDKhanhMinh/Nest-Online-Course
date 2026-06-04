import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CreateNotificationUseCase } from './create-notification.use-case';
import { GetNotificationsUseCase } from './get-notifications.use-case';
import { MarkNotificationAsReadUseCase } from './mark-notification-as-read.use-case';
import { RegisterFcmTokenUseCase } from './register-fcm-token.use-case';
import { INOTIFICATION_REPOSITORY } from '@domain/notification/ports/i-notification.repository';
import { INOTIFICATION_DEVICE_REPOSITORY } from '@domain/notification/ports/i-notification-device.repository';
import { IPUSH_NOTIFICATION_SERVICE } from '@domain/notification/ports/i-push-notification.service';
import { UniqueId } from '@shared/types/unique-id.vo';
import { Notification } from '@domain/notification/entities/notification.entity';
import { NotificationDevice } from '@domain/notification/entities/notification-device.entity';
import { NotificationType, NotificationPriority } from '@domain/notification/types/notification.types';

describe('Notification Use Cases', () => {
  let createUseCase: CreateNotificationUseCase;
  let getUseCase: GetNotificationsUseCase;
  let markAsReadUseCase: MarkNotificationAsReadUseCase;
  let registerDeviceUseCase: RegisterFcmTokenUseCase;

  const mockRecipientId = UniqueId.generate();
  const mockNotification = Notification.create({
    recipientId: mockRecipientId,
    title: 'Test Notification',
    content: 'This is a test notification',
    type: NotificationType.ORDER_SUCCESS,
    priority: NotificationPriority.NORMAL,
  });

  const mockDevice = NotificationDevice.create({
    userId: mockRecipientId,
    fcmToken: 'token-123',
    platform: 'WEB',
    isActive: true,
  });

  const mockNotificationRepo = {
    save: jest.fn().mockResolvedValue(undefined),
    findByIdAndRecipient: jest.fn().mockImplementation(async (id: UniqueId, recipientId: UniqueId) => {
      if (id.equals(mockNotification.id) && recipientId.equals(mockRecipientId)) {
        return mockNotification;
      }
      return null;
    }),
    findByRecipient: jest.fn().mockImplementation(async (recipientId: UniqueId, limit: number, offset: number) => {
      if (recipientId.equals(mockRecipientId)) {
        return { notifications: [mockNotification], total: 1 };
      }
      return { notifications: [], total: 0 };
    }),
    countUnread: jest.fn().mockResolvedValue(1),
    findByDedupeKey: jest.fn().mockResolvedValue(null),
  };

  const mockDeviceRepo = {
    save: jest.fn().mockResolvedValue(undefined),
    findByFcmToken: jest.fn().mockImplementation(async (token: string) => {
      if (token === 'token-123') return mockDevice;
      return null;
    }),
    findByUserAndToken: jest.fn(),
  };

  const mockPushService = {
    sendToUser: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateNotificationUseCase,
        GetNotificationsUseCase,
        MarkNotificationAsReadUseCase,
        RegisterFcmTokenUseCase,
        { provide: INOTIFICATION_REPOSITORY, useValue: mockNotificationRepo },
        { provide: INOTIFICATION_DEVICE_REPOSITORY, useValue: mockDeviceRepo },
        { provide: IPUSH_NOTIFICATION_SERVICE, useValue: mockPushService },
      ],
    }).compile();

    createUseCase = module.get<CreateNotificationUseCase>(CreateNotificationUseCase);
    getUseCase = module.get<GetNotificationsUseCase>(GetNotificationsUseCase);
    markAsReadUseCase = module.get<MarkNotificationAsReadUseCase>(MarkNotificationAsReadUseCase);
    registerDeviceUseCase = module.get<RegisterFcmTokenUseCase>(RegisterFcmTokenUseCase);
  });

  describe('CreateNotificationUseCase', () => {
    it('should successfully create a notification and trigger push dispatch', async () => {
      const result = await createUseCase.execute({
        recipientId: mockRecipientId.value,
        title: 'New Purchase',
        content: 'You bought a course!',
        type: NotificationType.ORDER_SUCCESS,
      });

      expect(result).toBeDefined();
      expect(result.title).toBe('New Purchase');
      expect(mockNotificationRepo.save).toHaveBeenCalled();
      expect(mockPushService.sendToUser).toHaveBeenCalled();
    });
  });

  describe('GetNotificationsUseCase', () => {
    it('should return a paginated list of user notifications', async () => {
      const result = await getUseCase.execute(mockRecipientId.value, { page: 1, limit: 10 });
      expect(result).toBeDefined();
      expect(result.items.length).toBe(1);
      expect(result.total).toBe(1);
      expect(result.unreadCount).toBe(1);
    });
  });

  describe('MarkNotificationAsReadUseCase', () => {
    it('should mark notification as read', async () => {
      await markAsReadUseCase.execute(mockNotification.id.value, mockRecipientId.value);
      expect(mockNotification.isRead).toBe(true);
      expect(mockNotificationRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if notification does not exist or wrong recipient', async () => {
      await expect(
        markAsReadUseCase.execute('wrong-id', mockRecipientId.value),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('RegisterFcmTokenUseCase', () => {
    it('should register a new device if not registered', async () => {
      await registerDeviceUseCase.execute({
        userId: mockRecipientId.value,
        fcmToken: 'token-456',
        platform: 'WEB',
      });
      expect(mockDeviceRepo.save).toHaveBeenCalled();
    });

    it('should reactivate device if token is already registered', async () => {
      await registerDeviceUseCase.execute({
        userId: mockRecipientId.value,
        fcmToken: 'token-123',
        platform: 'WEB',
      });
      expect(mockDeviceRepo.save).toHaveBeenCalled();
      expect(mockDevice.isActive).toBe(true);
    });
  });
});
