export interface IEmailNotificationService {
  sendEnrollmentConfirmation(to: string, courseName: string): Promise<void>;
  sendCertificateReady(to: string, courseName: string, certificateUrl: string): Promise<void>;
}

export const IEMAIL_NOTIFICATION_SERVICE = Symbol('IEmailNotificationService');



