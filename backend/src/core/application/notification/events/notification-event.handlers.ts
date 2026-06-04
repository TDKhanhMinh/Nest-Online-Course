import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderSuccessEvent } from '@application/order/events/order-success.event';
import { CertificateIssuedEvent } from '@domain/certificate/events/certificate-issued.event';
import { QuizPassedEvent } from '@domain/quiz/events/quiz-passed.event';
import { ICourseRepository, ICOURSE_REPOSITORY } from '@domain/course/ports/i-course.repository';
import { IQuizRepository, QUIZ_REPOSITORY } from '@domain/quiz/ports/i-quiz.repository';
import { CreateNotificationUseCase } from '../use-cases/create-notification.use-case';
import { UniqueId } from '@shared/types/unique-id.vo';
import { NotificationType, NotificationTargetType } from '@domain/notification/types/notification.types';

@Injectable()
export class NotificationEventHandlers {
  private readonly logger = new Logger(NotificationEventHandlers.name);

  constructor(
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepo: IQuizRepository,
  ) {}

  @OnEvent('order.success', { async: true })
  async handleOrderSuccess(event: OrderSuccessEvent): Promise<void> {
    this.logger.log(`Handling order.success event for student ${event.studentId}, order ${event.orderId}`);

    for (const courseId of event.courseIds) {
      let courseTitle = 'Khóa học';
      try {
        const course = await this.courseRepo.findById(new UniqueId(courseId));
        if (course) {
          courseTitle = course.title.value;
        }
      } catch (error) {
        this.logger.warn(`Failed to fetch course details for courseId ${courseId}: ${error.message}`);
      }

      await this.createNotificationUseCase.execute({
        recipientId: event.studentId,
        title: 'Thanh toán thành công',
        content: `Bạn đã thanh toán thành công và đăng ký khóa học "${courseTitle}".`,
        type: NotificationType.ORDER_SUCCESS,
        actionUrl: `/courses/${courseId}`,
        targetType: NotificationTargetType.ORDER,
        targetId: event.orderId,
        dedupeKey: `ORDER_SUCCESS:${event.orderId}:${courseId}`,
        payload: {
          orderId: event.orderId,
          courseId,
          courseTitle,
        },
      });
    }
  }

  @OnEvent('CertificateIssuedEvent', { async: true })
  async handleCertificateIssued(event: CertificateIssuedEvent): Promise<void> {
    this.logger.log(`Handling CertificateIssuedEvent for student ${event.studentId.value}`);

    let courseTitle = 'Khóa học';
    try {
      const course = await this.courseRepo.findById(event.courseId);
      if (course) {
        courseTitle = course.title.value;
      }
    } catch (error) {
      this.logger.warn(`Failed to fetch course details for courseId ${event.courseId.value}: ${error.message}`);
    }

    await this.createNotificationUseCase.execute({
      recipientId: event.studentId.value,
      title: 'Chứng chỉ khóa học đã sẵn sàng',
      content: `Chúc mừng! Chứng chỉ hoàn thành khóa học "${courseTitle}" của bạn đã được cấp.`,
      type: NotificationType.CERTIFICATE_ISSUED,
      actionUrl: `/profile/certificates`,
      targetType: NotificationTargetType.CERTIFICATE,
      targetId: event.courseId.value,
      dedupeKey: `CERTIFICATE_ISSUED:${event.studentId.value}:${event.courseId.value}`,
      payload: {
        courseId: event.courseId.value,
        courseTitle,
        certificateUrl: event.certificateUrl,
        certificateNumber: event.certificateNumber,
      },
    });
  }

  @OnEvent('quiz.passed', { async: true })
  async handleQuizPassed(event: QuizPassedEvent): Promise<void> {
    this.logger.log(`Handling quiz.passed event for student ${event.studentId.value}, quiz ${event.quizId.value}`);

    let quizTitle = 'Bài trắc nghiệm';
    try {
      const quiz = await this.quizRepo.findById(event.quizId);
      if (quiz) {
        quizTitle = quiz.title;
      }
    } catch (error) {
      this.logger.warn(`Failed to fetch quiz details for quizId ${event.quizId.value}: ${error.message}`);
    }

    await this.createNotificationUseCase.execute({
      recipientId: event.studentId.value,
      title: 'Đạt yêu cầu bài thi trắc nghiệm',
      content: `Chúc mừng! Bạn đã hoàn thành bài thi trắc nghiệm "${quizTitle}" với điểm số ${event.score}/${event.passingScore}.`,
      type: NotificationType.QUIZ_PASSED,
      actionUrl: `/courses/lessons/quiz/${event.quizId.value}`,
      targetType: NotificationTargetType.QUIZ,
      targetId: event.quizId.value,
      dedupeKey: `QUIZ_PASSED:${event.studentId.value}:${event.quizId.value}:${event.score}`,
      payload: {
        quizId: event.quizId.value,
        quizTitle,
        score: event.score,
        passingScore: event.passingScore,
      },
    });
  }
}
