import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICertificateRepository } from '@/common/abstractions/repositories/i-certificate.repository';
import { Certificate } from '@/api/certificate/entities/certificate.entity';
import { UniqueId } from '@/common/types/unique-id.vo';
import { CertificateDocument } from '@/database/schemas/certificate.schema';
import { CertificateMapper } from '@/api/certificate/certificate.mapper';

@Injectable()
export class CertificateMongooseRepository implements ICertificateRepository {
  constructor(
    @InjectModel(CertificateDocument.name)
    private readonly certModel: Model<CertificateDocument>,
    private readonly mapper: CertificateMapper,
  ) {}

  async findById(id: UniqueId): Promise<Certificate | null> {
    const doc = await this.certModel.findById(id.value).lean().exec();
    return doc ? this.mapper.toDomain(doc as CertificateDocument) : null;
  }

  async findByStudentAndCourse(
    studentId: UniqueId,
    courseId: UniqueId,
  ): Promise<Certificate | null> {
    const doc = await this.certModel
      .findOne({ studentId: studentId.value, courseId: courseId.value })
      .lean()
      .exec();
    return doc ? this.mapper.toDomain(doc as CertificateDocument) : null;
  }

  async findAllByStudent(studentId: UniqueId): Promise<Certificate[]> {
    const docs = await this.certModel
      .find({ studentId: studentId.value })
      .lean()
      .exec();
    return docs.map((d) => this.mapper.toDomain(d as CertificateDocument));
  }

  async save(certificate: Certificate): Promise<void> {
    const data = this.mapper.toPersistence(certificate);
    await this.certModel
      .findByIdAndUpdate(data._id, data, { upsert: true, new: true })
      .exec();
  }
}
