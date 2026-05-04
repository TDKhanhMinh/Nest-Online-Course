import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IEnrollmentRepository } from '../../../domain/ports/enrollment.repository.interface';
import { Enrollment } from '../../../domain/entities/enrollment.entity';
import { UniqueId } from '@/infrastructure/shared-kernel/value-objects/unique-id.vo';
import { EnrollmentDocument } from '../schemas/enrollment.schema';
import { EnrollmentMapper } from '../mappers/enrollment.mapper';

@Injectable()
export class EnrollmentMongooseRepository implements IEnrollmentRepository {
  constructor(
    @InjectModel(EnrollmentDocument.name)
    private readonly enrollmentModel: Model<EnrollmentDocument>,
    private readonly mapper: EnrollmentMapper,
  ) {}

  async findById(id: UniqueId): Promise<Enrollment | null> {
    const doc = await this.enrollmentModel.findById(id.value).lean().exec();
    return doc ? this.mapper.toDomain(doc as EnrollmentDocument) : null;
  }

  async findByStudentAndCourse(studentId: UniqueId, courseId: UniqueId): Promise<Enrollment | null> {
    const doc = await this.enrollmentModel
      .findOne({ studentId: studentId.value, courseId: courseId.value })
      .lean()
      .exec();
    return doc ? this.mapper.toDomain(doc as EnrollmentDocument) : null;
  }

  async findAllByStudent(studentId: UniqueId): Promise<Enrollment[]> {
    const docs = await this.enrollmentModel
      .find({ studentId: studentId.value })
      .lean()
      .exec();
    return docs.map((d) => this.mapper.toDomain(d as EnrollmentDocument));
  }

  async save(enrollment: Enrollment): Promise<void> {
    const data = this.mapper.toPersistence(enrollment);
    await this.enrollmentModel
      .findByIdAndUpdate(data._id, data, { upsert: true, new: true })
      .exec();
  }

  async delete(id: UniqueId): Promise<void> {
    await this.enrollmentModel.findByIdAndDelete(id.value).exec();
  }
}
