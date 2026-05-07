import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from '@domain/course/entities/course.entity';
import { CourseDocument } from '@/database/schemas/course.schema';
import { ICourseRepository } from '@domain/course/ports/i-course.repository';
import { CourseMapper } from '../mappers/course.mapper';
import { UniqueId } from '@shared/types/unique-id.vo';
import { PageOptionsDto } from '@shared/pagination/offset/page-options.dto';
import { PageDto } from '@shared/pagination/offset/page.dto';
import { PageMetaDto } from '@shared/pagination/offset/page-meta.dto';
import { CursorOptionsDto } from '@shared/pagination/cursor/cursor-options.dto';
import { CursorPageDto } from '@shared/pagination/cursor/cursor-page.dto';
import { CursorMetaDto } from '@shared/pagination/cursor/cursor-meta.dto';
import { Order } from '@shared/pagination/order.enum';

@Injectable()
export class MongooseCourseRepository implements ICourseRepository {
  constructor(
    @InjectModel(CourseDocument.name) private readonly courseModel: Model<CourseDocument>,
  ) {}

  async findById(id: UniqueId): Promise<Course | null> {
    const doc = await this.courseModel.findById(id.value).exec();
    if (!doc) return null;
    return CourseMapper.toDomain(doc);
  }

  async findByIdOrThrow(id: UniqueId): Promise<Course> {
    const course = await this.findById(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id.value} not found`);
    }
    return course;
  }

  async findBySlug(slug: string): Promise<Course | null> {
    const doc = await this.courseModel.findOne({ slug }).exec();
    if (!doc) return null;
    return CourseMapper.toDomain(doc);
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const count = await this.courseModel.countDocuments({ slug }).exec();
    return count > 0;
  }

  async findAll(): Promise<Course[]> {
    const docs = await this.courseModel.find().exec();
    return docs.map((doc) => CourseMapper.toDomain(doc));
  }

  async findAllWithOffset(pageOptionsDto: PageOptionsDto): Promise<PageDto<Course>> {
    const query = this.courseModel.find();
    const limit = pageOptionsDto.limit ?? 10;
    const skip = pageOptionsDto.skip ?? 0;
    
    const [docs, total] = await Promise.all([
      query
        .sort({ createdAt: pageOptionsDto.order === 'ASC' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.courseModel.countDocuments().exec(),
    ]);

    const courses = docs.map((doc) => CourseMapper.toDomain(doc));
    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto });

    return new PageDto(courses, pageMetaDto);
  }

  async findAllWithCursor(cursorOptionsDto: CursorOptionsDto): Promise<CursorPageDto<Course>> {
    const limit = cursorOptionsDto.limit ?? 10;
    const order = cursorOptionsDto.order === Order.ASC ? 1 : -1;
    const query: any = {};

    if (cursorOptionsDto.cursor) {
      query._id = cursorOptionsDto.order === Order.ASC 
        ? { $gt: cursorOptionsDto.cursor } 
        : { $lt: cursorOptionsDto.cursor };
    }

    const docs = await this.courseModel
      .find(query)
      .sort({ _id: order as any })
      .limit(limit + 1)
      .exec();

    const hasNextPage = docs.length > limit;
    const items = hasNextPage ? docs.slice(0, limit) : docs;
    const nextCursor = hasNextPage ? (items[items.length - 1]._id as any).toString() : null;

    const courses = items.map((doc) => CourseMapper.toDomain(doc));
    
    return new CursorPageDto(courses, new CursorMetaDto({
      hasNextPage,
      nextCursor,
    }));
  }

  async findByInstructorId(instructorId: string, pageOptionsDto: PageOptionsDto): Promise<PageDto<Course>> {
    const query = { instructorId };
    const limit = pageOptionsDto.limit ?? 10;
    const skip = pageOptionsDto.skip ?? 0;

    const [docs, total] = await Promise.all([
      this.courseModel
        .find(query)
        .sort({ createdAt: pageOptionsDto.order === 'ASC' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.courseModel.countDocuments(query).exec(),
    ]);

    const courses = docs.map((doc) => CourseMapper.toDomain(doc));
    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto });

    return new PageDto(courses, pageMetaDto);
  }

  async findAdminCourses(pageOptionsDto: any): Promise<PageDto<Course>> {
    return this.findAllWithOffset(pageOptionsDto);
  }

  async save(course: Course): Promise<void> {
    const persistenceData = CourseMapper.toPersistence(course);
    await this.courseModel
      .findByIdAndUpdate(course.id.value, persistenceData, {
        upsert: true,
        new: true,
      })
      .exec();
  }

  async delete(id: UniqueId): Promise<void> {
    await this.courseModel.findByIdAndDelete(id.value).exec();
  }
}

