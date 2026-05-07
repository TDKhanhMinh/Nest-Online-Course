import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Certificate } from '@domain/certificate/entities/certificate.entity';
import { CertificateDocument } from '@/database/schemas/certificate.schema';
import { ICertificateRepository } from '@domain/certificate/ports/i-certificate.repository';
import { CertificateMapper } from '../mappers/certificate.mapper';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class MongooseCertificateRepository implements ICertificateRepository {
  constructor(
    @InjectModel(CertificateDocument.name) private readonly certificateModel: Model<CertificateDocument>,
  ) {}

  async findById(id: UniqueId): Promise<Certificate | null> {
    const doc = await this.certificateModel.findById(id.value).exec();
    if (!doc) return null;
    return CertificateMapper.toDomain(doc);
  }

  async findByStudentAndCourse(studentId: UniqueId, courseId: UniqueId): Promise<Certificate | null> {
    const doc = await this.certificateModel
      .findOne({ studentId: studentId.value, courseId: courseId.value })
      .exec();
    if (!doc) return null;
    return CertificateMapper.toDomain(doc);
  }

  async findAllByStudent(studentId: UniqueId): Promise<Certificate[]> {
    const docs = await this.certificateModel.find({ studentId: studentId.value }).exec();
    return docs.map((doc) => CertificateMapper.toDomain(doc));
  }

  async save(certificate: Certificate): Promise<void> {
    const persistenceData = CertificateMapper.toPersistence(certificate);
    await this.certificateModel
      .findByIdAndUpdate(certificate.id.value, persistenceData, {
        upsert: true,
        new: true,
      })
      .exec();
  }
}
