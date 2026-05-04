import { DomainEvent } from '@/common/abstractions/domain-event.base';
import { UniqueId } from '@/common/types/unique-id.vo';

export class CertificateIssuedEvent extends DomainEvent {
  readonly certificateId: UniqueId;
  readonly studentId: UniqueId;
  readonly courseId: UniqueId;
  readonly certificateUrl: string;

  constructor(props: {
    certificateId: UniqueId;
    studentId: UniqueId;
    courseId: UniqueId;
    certificateUrl: string;
    occurredAt?: Date;
  }) {
    super(props.occurredAt);
    this.certificateId  = props.certificateId;
    this.studentId      = props.studentId;
    this.courseId       = props.courseId;
    this.certificateUrl = props.certificateUrl;
  }
}
