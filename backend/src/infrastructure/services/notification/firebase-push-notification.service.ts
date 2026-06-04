import * as admin from 'firebase-admin';
import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IPushNotificationService,
  PushNotificationPayload,
  MulticastPushNotificationPayload,
} from '@domain/notification/ports/i-push-notification.service';
import {
  INotificationDeviceRepository,
  INOTIFICATION_DEVICE_REPOSITORY,
} from '@domain/notification/ports/i-notification-device.repository';

@Injectable()
export class FirebasePushNotificationService implements IPushNotificationService {
  private readonly logger = new Logger(FirebasePushNotificationService.name);
  private firebaseApp: admin.app.App | null = null;

  constructor(
    private readonly configService: ConfigService,
    @Inject(INOTIFICATION_DEVICE_REPOSITORY)
    private readonly deviceRepo: INotificationDeviceRepository,
  ) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    if (admin.apps.length > 0) {
      this.firebaseApp = admin.apps[0];
      return;
    }

    const serviceAccountPath = this.configService.get<string>('firebase.serviceAccountPath');
    const projectId = this.configService.get<string>('firebase.projectId');
    const clientEmail = this.configService.get<string>('firebase.clientEmail');
    const privateKey = this.configService.get<string>('firebase.privateKey');

    try {
      if (serviceAccountPath) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const fs = require('fs');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const path = require('path');
        const resolvedPath = path.resolve(serviceAccountPath);
        if (fs.existsSync(resolvedPath)) {
          const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
          this.firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
          this.logger.log('Firebase initialized successfully from Service Account file.');
          return;
        } else {
          this.logger.warn(`Firebase Service Account file not found at: ${resolvedPath}`);
        }
      }

      if (projectId && clientEmail && privateKey) {
        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
        this.logger.log('Firebase initialized successfully from environment credentials.');
        return;
      }

      this.logger.warn(
        'Firebase Push Notification Service is NOT configured with proper credentials. Push notifications will be bypassed.',
      );
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin SDK', error);
    }
  }

  async sendToUser(payload: PushNotificationPayload): Promise<void> {
    if (!this.firebaseApp) {
      this.logger.warn(
        `Firebase is not initialized. Bypassing push to user: ${payload.userId.value}`,
      );
      return;
    }

    try {
      const tokens = await this.deviceRepo.findActiveTokensByUserId(payload.userId);
      if (tokens.length === 0) {
        return;
      }

      const message: admin.messaging.MulticastMessage = {
        tokens,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: {
          notificationId: payload.notificationId.value,
          type: payload.type,
          actionUrl: payload.actionUrl ?? '',
          ...(payload.data ?? {}),
        },
        webpush: {
          fcmOptions: {
            link: payload.actionUrl ?? '/',
          },
        },
      };

      const result = await this.firebaseApp.messaging().sendEachForMulticast(message);

      const invalidTokens: string[] = [];
      result.responses.forEach((response, index) => {
        if (!response.success) {
          const error = response.error;
          if (
            error?.code === 'messaging/registration-token-not-registered' ||
            error?.code === 'messaging/invalid-registration-token'
          ) {
            invalidTokens.push(tokens[index]);
          }
          this.logger.warn(`Failed to send FCM to token at index ${index}: ${error?.message}`);
        }
      });

      if (invalidTokens.length > 0) {
        this.logger.log(`Deactivating ${invalidTokens.length} expired FCM tokens.`);
        await this.deviceRepo.deactivateTokens(invalidTokens);
      }
    } catch (error) {
      this.logger.error(`Error sending push notification to user ${payload.userId.value}`, error);
    }
  }

  async sendMulticast(payload: MulticastPushNotificationPayload): Promise<{ successCount: number; failureCount: number }> {
    if (!this.firebaseApp) {
      this.logger.warn('Firebase is not initialized. Bypassing sendMulticast.');
      return { successCount: 0, failureCount: payload.tokens.length };
    }

    const { tokens, title, body, type, actionUrl, data } = payload;
    if (tokens.length === 0) {
      return { successCount: 0, failureCount: 0 };
    }

    // Split tokens into batches of 500
    const batchSize = 500;
    const tokenBatches: string[][] = [];
    for (let i = 0; i < tokens.length; i += batchSize) {
      tokenBatches.push(tokens.slice(i, i + batchSize));
    }

    let totalSuccessCount = 0;
    let totalFailureCount = 0;
    const allInvalidTokens: string[] = [];

    // Concurrency runner helper
    const runWithLimit = async <T>(limit: number, items: T[], fn: (item: T) => Promise<any>) => {
      const results = [];
      const executing = new Set<Promise<any>>();
      for (const item of items) {
        const p = Promise.resolve().then(() => fn(item));
        results.push(p);
        executing.add(p);
        const clean = () => executing.delete(p);
        p.then(clean, clean);
        if (executing.size >= limit) {
          await Promise.race(executing);
        }
      }
      return Promise.all(results);
    };

    await runWithLimit(3, tokenBatches, async (batch) => {
      const message: admin.messaging.MulticastMessage = {
        tokens: batch,
        notification: {
          title,
          body,
        },
        data: {
          type,
          actionUrl: actionUrl ?? '',
          ...(data ?? {}),
        },
        webpush: {
          fcmOptions: {
            link: actionUrl ?? '/',
          },
        },
      };

      try {
        const result = await this.firebaseApp.messaging().sendEachForMulticast(message);
        totalSuccessCount += result.successCount;
        totalFailureCount += result.failureCount;

        result.responses.forEach((response, index) => {
          if (!response.success) {
            const error = response.error;
            if (
              error?.code === 'messaging/registration-token-not-registered' ||
              error?.code === 'messaging/invalid-registration-token'
            ) {
              allInvalidTokens.push(batch[index]);
            }
          }
        });
      } catch (err: any) {
        this.logger.error('Error sending multicast batch to FCM', err);
        totalFailureCount += batch.length;
      }
    });

    if (allInvalidTokens.length > 0) {
      this.logger.log(`Deactivating ${allInvalidTokens.length} expired FCM tokens from multicast.`);
      try {
        await this.deviceRepo.deactivateTokens(allInvalidTokens);
      } catch (err) {
        this.logger.error('Error deactivating tokens from multicast', err);
      }
    }

    return { successCount: totalSuccessCount, failureCount: totalFailureCount };
  }
}
