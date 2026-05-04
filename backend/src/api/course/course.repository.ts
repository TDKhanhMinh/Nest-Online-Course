import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICourseRepository } from '@/common/abstractions/course.repository.interface';
import { Course } from '@/api/course/entities/course.entity';
import { UniqueId } from '@/common/types/unique-id.vo';
import { CourseDocument } from '@/database/schemas/course.schema';
import { CourseMapper } from '@/api/course/course.mapper';
import { DomainException } from '@/exceptions/domain-exception.base';
import { ErrorCode } from '@/exceptions/error-codes.enum';
import { PageOptionsDto } from '@/common/pagination/offset/page-options.dto';
import { PageDto } from '@/common/pagination/offset/page.dto';
import { PageMetaDto } from '@/common/pagination/offset/page-meta.dto';
import { CursorOptionsDto } from '@/common/pagination/cursor/cursor-options.dto';
import { CursorPageDto } from '@/common/pagination/cursor/cursor-page.dto';
import { CursorMetaDto } from '@/common/pagination/cursor/cursor-meta.dto';
import { Order } from '@/common/pagination/order.enum';

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
    if (!course) throw new DomainException(ErrorCode.COURSE_NOT_FOUND, `Course ${id.value} not found`);
    return course;
  }

  async findAll(): Promise<Course[]> {
    const docs = await this.courseModel.find().lean().exec();
    return docs.map((d) => this.mapper.toDomain(d as CourseDocument));
  }

  async findAllWithOffset(pageOptionsDto: PageOptionsDto): Promise<PageDto<Course>> {
    const queryBuilder = this.courseModel.find();
    
    queryBuilder.sort({ createdAt: pageOptionsDto.order === Order.ASC ? 1 : -1 });
    queryBuilder.skip(pageOptionsDto.skip).limit(pageOptionsDto.limit ?? 10);

    const itemCount = await this.courseModel.countDocuments();
    const docs = await queryBuilder.lean().exec();
    
    const courses = docs.map((d) => this.mapper.toDomain(d as CourseDocument));
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    
    return new PageDto(courses, pageMetaDto);
  }

  async findAllWithCursor(cursorOptionsDto: CursorOptionsDto): Promise<CursorPageDto<Course>> {
    const limit = cursorOptionsDto.limit ?? 10;
    const order = cursorOptionsDto.order === Order.ASC ? 1 : -1;
    let query: Record<string, any> = {};

    if (cursorOptionsDto.cursor) {
      // Decode base64 cursor to get _id
      const cursorDecoded = Buffer.from(cursorOptionsDto.cursor, 'base64').toString('utf8');
      query = { _id: order === 1 ? { $gt: cursorDecoded } : { $lt: cursorDecoded } };
    }

    const docs = await this.courseModel
      .find(query)
      .sort({ _id: order })
      // Fetch limit + 1 to determine if there is a next page
      .limit(limit + 1)
      .lean()
      .exec();

    const hasNextPage = docs.length > limit;
    if (hasNextPage) {
      docs.pop(); // Remove the extra item used for checking
    }

    const courses = docs.map((d) => this.mapper.toDomain(d as CourseDocument));
    
    let nextCursor: string | null = null;
    if (hasNextPage && docs.length > 0) {
      const lastDoc = docs[docs.length - 1];
      // Encode the last document's _id as base64
      nextCursor = Buffer.from(lastDoc._id.toString()).toString('base64');
    }

    const cursorMetaDto = new CursorMetaDto({ hasNextPage, nextCursor });
    return new CursorPageDto(courses, cursorMetaDto);
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
