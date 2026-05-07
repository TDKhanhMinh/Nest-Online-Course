import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderSuccessEvent } from '@application/order/events/order-success.event';
import { EnrollStudentUseCase } from '../use-cases/enroll-student.use-case';

@Injectable()
export class OnOrderSuccessHandler {
  private readonly logger = new Logger(OnOrderSuccessHandler.name);

  constructor(private readonly enrollStudentUseCase: EnrollStudentUseCase) {}

  @OnEvent('order.success')
  async handleOrderSuccess(event: OrderSuccessEvent): Promise<void> {
    this.logger.log(`Handling order.success for student ${event.studentId}, order ${event.orderId}`);

    for (const courseId of event.courseIds) {
      try {
        await this.enrollStudentUseCase.execute({
          studentId: event.studentId,
          courseId,
          studentEmail: event.studentEmail,
        });
        this.logger.log(`Successfully enrolled student ${event.studentId} in course ${courseId}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack : undefined;

        this.logger.error(
          `Failed to enroll student ${event.studentId} in course ${courseId}: ${message}`,
          stack,
        );
      }
    }
  }
}
