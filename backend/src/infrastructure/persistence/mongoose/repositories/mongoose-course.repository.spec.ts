import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongooseCourseRepository } from './mongoose-course.repository';
import { CourseDocument, CourseSchema } from '@/database/schemas/course.schema';
import { rootMongooseTestModule, closeInMongodConnection } from '../test-utils/mongoose-test.module';
import { Course } from '@domain/course/entities/course.entity';
import { CourseTitle } from '@domain/course/value-objects/course-title.vo';
import { CourseLevel } from '@shared/types/course-level.enum';
import { CourseStatus } from '@shared/types/course-status.enum';
import { UniqueId } from '@shared/types/unique-id.vo';
import { Model } from 'mongoose';
import { PageOptionsDto } from '@shared/pagination/offset/page-options.dto';
import { CursorOptionsDto } from '@shared/pagination/cursor/cursor-options.dto';
import { Order } from '@shared/pagination/order.enum';

describe('MongooseCourseRepository', () => {
  let repository: MongooseCourseRepository;
  let courseModel: Model<any>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: CourseDocument.name, schema: CourseSchema }]),
      ],
      providers: [MongooseCourseRepository],
    }).compile();

    repository = module.get<MongooseCourseRepository>(MongooseCourseRepository);
    courseModel = module.get<Model<any>>(getModelToken(CourseDocument.name));
  });

  beforeEach(async () => {
    await courseModel.deleteMany({});
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await module.close();
  });

  const createDummyCourse = (title = 'Test Course', slug = 'test-course') => {
    return Course.create({
      title: new CourseTitle(title),
      slug,
      description: 'Description',
      instructorId: UniqueId.generate(),
      categoryId: UniqueId.generate(),
      price: 99.99,
      level: CourseLevel.BEGINNER,
      language: 'English',
      status: CourseStatus.PUBLISHED,
    });
  };

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('should save a course', async () => {
      const course = createDummyCourse();
      await repository.save(course);

      const found = await repository.findById(course.id);
      expect(found).toBeDefined();
      expect(found?.slug).toBe(course.slug);
    });
  });

  describe('findBySlug', () => {
    it('should find a course by slug', async () => {
      const course = createDummyCourse('Slug Course', 'slug-course');
      await repository.save(course);

      const found = await repository.findBySlug('slug-course');
      expect(found).toBeDefined();
      expect(found?.id.equals(course.id)).toBe(true);
    });
  });

  describe('findAllWithOffset', () => {
    it('should return paginated courses', async () => {
      await repository.save(createDummyCourse('Course 1', 'c1'));
      await repository.save(createDummyCourse('Course 2', 'c2'));

      const pageOptionsDto = Object.assign(new PageOptionsDto(), {
        limit: 1,
        page: 1,
      });

      const result = await repository.findAllWithOffset(pageOptionsDto);
      expect(result.data.length).toBe(1);
      expect(result.meta.itemCount).toBe(2);
    });
  });

  describe('findAllWithCursor', () => {
    it('should return cursor paginated courses', async () => {
      await repository.save(createDummyCourse('Course 1', 'c1'));
      await repository.save(createDummyCourse('Course 2', 'c2'));
      await repository.save(createDummyCourse('Course 3', 'c3'));

      const result1 = await repository.findAllWithCursor(Object.assign(new CursorOptionsDto(), { limit: 2, order: Order.ASC }));
      expect(result1.data.length).toBe(2);
      expect(result1.meta.hasNextPage).toBe(true);
      expect(result1.meta.nextCursor).toBeDefined();

      const result2 = await repository.findAllWithCursor(Object.assign(new CursorOptionsDto(), { limit: 2, order: Order.ASC, cursor: result1.meta.nextCursor }));
      expect(result2.data.length).toBe(1);
      expect(result2.meta.hasNextPage).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete a course', async () => {
      const course = createDummyCourse();
      await repository.save(course);
      await repository.delete(course.id);

      const found = await repository.findById(course.id);
      expect(found).toBeNull();
    });
  });
});
