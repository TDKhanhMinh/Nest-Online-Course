export class IssueCertificateDto {
  studentId: string;
  courseId: string;
}

export class CertificateResponseDto {
  id: string;
  studentId: string;
  courseId: string;
  certificateNumber: string;
  certificateUrl: string;
  issuedAt: Date;
}
