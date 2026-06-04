import { CourseDocument } from '@/database/schemas/course.schema';
import { Course } from '@domain/course/entities/course.entity';
import { ICourseRepository } from '@domain/course/ports/i-course.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CursorMetaDto } from '@shared/pagination/cursor/cursor-meta.dto';
import { CursorOptionsDto } from '@shared/pagination/cursor/cursor-options.dto';
import { CursorPageDto } from '@shared/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from '@shared/pagination/offset/page-meta.dto';
import { PageOptionsDto } from '@shared/pagination/offset/page-options.dto';
import { PageDto } from '@shared/pagination/offset/page.dto';
import { Order } from '@shared/pagination/order.enum';
import { UniqueId } from '@shared/types/unique-id.vo';
import { Model } from 'mongoose';
import { CourseMapper } from '../mappers/course.mapper';

function escapeRegex(str: string): string {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

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

  async findAllWithOffset(
    pageOptionsDto: PageOptionsDto,
    extraFilter?: any,
    sort?: any,
  ): Promise<PageDto<Course>> {
    const query: any = { ...extraFilter };
    
    if (pageOptionsDto.search) {
      const escapedSearch = escapeRegex(pageOptionsDto.search);
      query.$or = [
        { title: { $regex: escapedSearch, $options: 'i' } },
        { description: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    const limit = pageOptionsDto.limit ?? 10;
    const skip = pageOptionsDto.skip ?? 0;
    
    const sortCriteria = sort || { createdAt: pageOptionsDto.order === 'ASC' ? 1 : -1 };

    const [docs, total] = await Promise.all([
      this.courseModel.find(query)
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.courseModel.countDocuments(query).exec(),
    ]);

    const courses = docs.map((doc) => CourseMapper.toDomain(doc));
    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto });

    return new PageDto(courses, pageMetaDto);
  }

  async findAllWithCursor(
    cursorOptionsDto: CursorOptionsDto,
    extraFilter?: any,
    sort?: any,
  ): Promise<CursorPageDto<Course>> {
    const limit = cursorOptionsDto.limit ?? 10;
    const order = cursorOptionsDto.order === Order.ASC ? 1 : -1;
    const query: any = { ...extraFilter };

    if (cursorOptionsDto.search) {
      const escapedSearch = escapeRegex(cursorOptionsDto.search);
      query.$or = [
        { title: { $regex: escapedSearch, $options: 'i' } },
        { description: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    if (cursorOptionsDto.cursor) {
      query._id = cursorOptionsDto.order === Order.ASC 
        ? { $gt: cursorOptionsDto.cursor } 
        : { $lt: cursorOptionsDto.cursor };
    }

    const sortCriteria = sort || { _id: order as any };

    const docs = await this.courseModel
      .find(query)
      .sort(sortCriteria)
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

  async findByInstructorId(instructorId: string, queryDto: any): Promise<PageDto<Course>> {
    const query: any = { instructorId };
    
    if (queryDto.status) {
      query.status = queryDto.status;
    }
    
    if (queryDto.search) {
      const escapedSearch = escapeRegex(queryDto.search);
      query.$or = [
        { title: { $regex: escapedSearch, $options: 'i' } },
        { description: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    const limit = queryDto.limit ?? 10;
    const skip = queryDto.skip ?? 0;

    const [docs, total] = await Promise.all([
      this.courseModel
        .find(query)
        .sort({ createdAt: queryDto.order === 'ASC' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.courseModel.countDocuments(query).exec(),
    ]);

    const courses = docs.map((doc) => CourseMapper.toDomain(doc));
    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto: queryDto });

    return new PageDto(courses, pageMetaDto);
  }

  async findAdminCourses(queryDto: any): Promise<PageDto<Course>> {
    const query: any = {};
    
    if (queryDto.status) {
      query.status = queryDto.status;
    }
    
    if (queryDto.categoryId) {
      query.categoryId = queryDto.categoryId;
    }
    
    if (queryDto.instructorId) {
      query.instructorId = queryDto.instructorId;
    }
    
    if (queryDto.search) {
      const escapedSearch = escapeRegex(queryDto.search);
      query.$or = [
        { title: { $regex: escapedSearch, $options: 'i' } },
        { description: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    const limit = queryDto.limit ?? 10;
    const skip = queryDto.skip ?? 0;

    const [docs, total] = await Promise.all([
      this.courseModel
        .find(query)
        .sort({ createdAt: queryDto.order === 'ASC' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.courseModel.countDocuments(query).exec(),
    ]);

    const courses = docs.map((doc) => CourseMapper.toDomain(doc));
    
    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto: queryDto });

    return new PageDto(courses, pageMetaDto);
  }

  async save(course: Course): Promise<void> {
    const persistenceData = CourseMapper.toPersistence(course);
    await this.courseModel
      .findByIdAndUpdate(course.id.value, persistenceData, {
        upsert: true,
        returnDocument: 'after',
      })
      .exec();
  }

  async delete(id: UniqueId): Promise<void> {
    await this.courseModel.findByIdAndDelete(id.value).exec();
  }
}
