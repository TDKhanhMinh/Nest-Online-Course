import { AggregateRoot } from '@shared/abstractions/aggregate-root.base';
import { UniqueId } from '@shared/types/unique-id.vo';
import { CertificateIssuedEvent } from '@domain/certificate/events/certificate-issued.event';

export interface CertificateProps {
  studentId: UniqueId;
  courseId: UniqueId;
  certificateNumber: string;
  certificateUrl: string;
  issuedAt: Date;
}

export class Certificate extends AggregateRoot<CertificateProps> {
  get studentId(): UniqueId {
    return this.props.studentId;
  }
  get courseId(): UniqueId {
    return this.props.courseId;
  }
  get certificateNumber(): string {
    return this.props.certificateNumber;
  }
  get certificateUrl(): string {
    return this.props.certificateUrl;
  }
  get issuedAt(): Date {
    return this.props.issuedAt;
  }

  static issue(
    studentId: UniqueId,
    courseId: UniqueId,
    certificateNumber: string,
    certificateUrl: string,
    id?: UniqueId,
  ): Certificate {
    const cert = new Certificate(
      {
        studentId,
        courseId,
        certificateNumber,
        certificateUrl,
        issuedAt: new Date(),
      },
      id ?? UniqueId.generate(),
    );

    cert.addDomainEvent(
      new CertificateIssuedEvent({
        certificateId: cert.id,
        studentId,
        courseId,
        certificateUrl,
      }),
    );

    return cert;
  }

  static reconstitute(props: CertificateProps, id: UniqueId): Certificate {
    return new Certificate(props, id);
  }
}



