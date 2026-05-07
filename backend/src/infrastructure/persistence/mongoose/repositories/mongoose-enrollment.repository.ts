import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment } from '@domain/enrollment/entities/enrollment.entity';
import { EnrollmentDocument } from '@/database/schemas/enrollment.schema';
import { IEnrollmentRepository } from '@domain/enrollment/ports/i-enrollment.repository';
import { EnrollmentMapper } from '../mappers/enrollment.mapper';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class MongooseEnrollmentRepository implements IEnrollmentRepository {
  constructor(
    @InjectModel(EnrollmentDocument.name) private readonly enrollmentModel: Model<EnrollmentDocument>,
  ) {}

  async findById(id: UniqueId): Promise<Enrollment | null> {
    const doc = await this.enrollmentModel.findById(id.value).exec();
    if (!doc) return null;
    return EnrollmentMapper.toDomain(doc);
  }

  async findByStudentAndCourse(studentId: UniqueId, courseId: UniqueId): Promise<Enrollment | null> {
    const doc = await this.enrollmentModel
      .findOne({ studentId: studentId.value, courseId: courseId.value })
      .exec();
    if (!doc) return null;
    return EnrollmentMapper.toDomain(doc);
  }

  async findAllByStudent(studentId: UniqueId): Promise<Enrollment[]> {
    const docs = await this.enrollmentModel.find({ studentId: studentId.value }).exec();
    return docs.map((doc) => EnrollmentMapper.toDomain(doc));
  }

  async save(enrollment: Enrollment): Promise<void> {
    const persistenceData = EnrollmentMapper.toPersistence(enrollment);
    await this.enrollmentModel
      .findByIdAndUpdate(enrollment.id.value, persistenceData, {
        upsert: true,
        new: true,
      })
      .exec();
  }

  async delete(id: UniqueId): Promise<void> {
    await this.enrollmentModel.findByIdAndDelete(id.value).exec();
  }
}
