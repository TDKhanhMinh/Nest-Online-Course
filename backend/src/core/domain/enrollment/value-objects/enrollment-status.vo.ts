import { ValueObject } from '@shared/abstractions/value-object.base';
import { EnrollmentStatusEnum } from '@shared/types/enrollment-status.enum';

export type EnrollmentStatusValue = EnrollmentStatusEnum;

interface EnrollmentStatusProps {
  value: EnrollmentStatusEnum;
}

export class EnrollmentStatus extends ValueObject<EnrollmentStatusProps> {
  get value(): EnrollmentStatusEnum {
    return this.props.value;
  }

  static active(): EnrollmentStatus {
    return new EnrollmentStatus({ value: EnrollmentStatusEnum.ACTIVE });
  }

  static completed(): EnrollmentStatus {
    return new EnrollmentStatus({ value: EnrollmentStatusEnum.COMPLETED });
  }

  static cancelled(): EnrollmentStatus {
    return new EnrollmentStatus({ value: EnrollmentStatusEnum.CANCELLED });
  }

  static create(value: string): EnrollmentStatus {
    const enumValue = value as EnrollmentStatusEnum;
    if (!Object.values(EnrollmentStatusEnum).includes(enumValue)) {
      throw new Error(`Invalid enrollment status: ${value}`);
    }
    return new EnrollmentStatus({ value: enumValue });
  }

  isActive(): boolean {
    return this.props.value === EnrollmentStatusEnum.ACTIVE;
  }

  isCompleted(): boolean {
    return this.props.value === EnrollmentStatusEnum.COMPLETED;
  }

  isCancelled(): boolean {
    return this.props.value === EnrollmentStatusEnum.CANCELLED;
  }
}
