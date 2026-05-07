import { DomainEvent } from '../../../shared/abstractions/domain-event.base';
import { UniqueId } from '@shared/types/unique-id.vo';

export class CertificateIssuedEvent extends DomainEvent {
  public readonly certificateId: UniqueId;
  public readonly studentId: UniqueId;
  public readonly courseId: UniqueId;
  public readonly certificateUrl: string;

  constructor(props: {
    certificateId: UniqueId;
    studentId: UniqueId;
    courseId: UniqueId;
    certificateUrl: string;
  }) {
    super();
    this.certificateId = props.certificateId;
    this.studentId = props.studentId;
    this.courseId = props.courseId;
    this.certificateUrl = props.certificateUrl;
  }
}
