export type EnrollmentStatusValue = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export class EnrollmentStatus {
  readonly value: EnrollmentStatusValue;

  constructor(value: EnrollmentStatusValue) {
    this.value = value;
  }

  isActive(): boolean    { return this.value === 'ACTIVE'; }
  isCompleted(): boolean { return this.value === 'COMPLETED'; }

  static active(): EnrollmentStatus    { return new EnrollmentStatus('ACTIVE'); }
  static completed(): EnrollmentStatus { return new EnrollmentStatus('COMPLETED'); }
  static cancelled(): EnrollmentStatus { return new EnrollmentStatus('CANCELLED'); }
}
