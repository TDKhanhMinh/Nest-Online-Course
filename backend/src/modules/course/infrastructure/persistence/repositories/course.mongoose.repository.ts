import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICourseRepository } from '../../../domain/ports/course.repository.interface';
import { Course } from '../../../domain/entities/course.entity';
import { UniqueId } from '@/infrastructure/shared-kernel/value-objects/unique-id.vo';
import { CourseDocument } from '../schemas/course.schema';
import { CourseMapper } from '../mappers/course.mapper';
import { CourseNotFoundException } from '../../../domain/exceptions/course-not-found.exception';

@Injectable()
export class CourseMongooseRepository implements ICourseRepository {
  constructor(
    @InjectModel(CourseDocument.name)
    private readonly courseModel: Model<CourseDocument>,
    private readonly mapper: CourseMapper,
  ) {}

  async findById(id: UniqueId): Promise<Course | null> {
    const doc = await this.courseModel.findById(id.value).lean().exec();
    return doc ? this.mapper.toDomain(doc as CourseDocument) : null;
  }

  async findByIdOrThrow(id: UniqueId): Promise<Course> {
    const course = await this.findById(id);
    if (!course) throw new CourseNotFoundException(id.value);
    return course;
  }

  async findAll(): Promise<Course[]> {
    const docs = await this.courseModel.find().lean().exec();
    return docs.map((d) => this.mapper.toDomain(d as CourseDocument));
  }

  async save(course: Course): Promise<void> {
    const data = this.mapper.toPersistence(course);
    await this.courseModel
      .findByIdAndUpdate(data._id, data, { upsert: true, new: true })
      .exec();
  }

  async delete(id: UniqueId): Promise<void> {
    await this.courseModel.findByIdAndDelete(id.value).exec();
  }
}
