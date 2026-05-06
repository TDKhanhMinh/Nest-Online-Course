import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderSuccessEvent } from '@/api/order/events/order-success.event';
import { EnrollmentService } from '@/api/enrollment/enrollment.service';

@Injectable()
export class OnOrderSuccessHandler {
  private readonly logger = new Logger(OnOrderSuccessHandler.name);

  constructor(private readonly enrollmentService: EnrollmentService) {}

  @OnEvent('order.success')
  async handleOrderSuccess(event: OrderSuccessEvent) {
    this.logger.log(`Handling order.success for student ${event.studentId}, order ${event.orderId}`);
    
    for (const courseId of event.courseIds) {
      try {
        await this.enrollmentService.enrollStudent({
          studentId: event.studentId,
          courseId: courseId,
          studentEmail: event.studentEmail,
        });
        this.logger.log(`Successfully enrolled student ${event.studentId} in course ${courseId}`);
      } catch (error) {
        this.logger.error(
          `Failed to enroll student ${event.studentId} in course ${courseId}: ${error.message}`,
        );
      }
    }
  }
}
