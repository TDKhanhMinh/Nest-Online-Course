import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongooseLessonRepository } from './mongoose-lesson.repository';
import { LessonDocument, LessonSchema } from '@/database/schemas/lesson.schema';
import { rootMongooseTestModule, closeInMongodConnection } from '../test-utils/mongoose-test.module';
import { Lesson } from '@domain/course/entities/lesson.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { LessonType } from '@shared/types/lesson-type.enum';
import { Model } from 'mongoose';

describe('MongooseLessonRepository', () => {
  let repository: MongooseLessonRepository;
  let lessonModel: Model<any>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: LessonDocument.name, schema: LessonSchema }]),
      ],
      providers: [MongooseLessonRepository],
    }).compile();

    repository = module.get<MongooseLessonRepository>(MongooseLessonRepository);
    lessonModel = module.get<Model<any>>(getModelToken(LessonDocument.name));
  });

  beforeEach(async () => {
    await lessonModel.deleteMany({});
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await module.close();
  });

  const createDummyLesson = (sectionId = UniqueId.generate(), title = 'Test Lesson', orderIndex = 0) => {
    return Lesson.create({
      sectionId,
      title,
      type: LessonType.VIDEO,
      contentUrl: 'http://example.com/video.mp4',
      duration: 600,
      orderIndex,
      isFreePreview: false,
    });
  };

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('should save a lesson', async () => {
      const lesson = createDummyLesson();
      await repository.save(lesson);

      const found = await repository.findById(lesson.id);
      expect(found).toBeDefined();
      expect(found?.title).toBe(lesson.title);
    });
  });

  describe('findBySectionId', () => {
    it('should find lessons by section id', async () => {
      const sectionId = UniqueId.generate();
      await repository.save(createDummyLesson(sectionId, 'Lesson 1', 1));
      await repository.save(createDummyLesson(sectionId, 'Lesson 2', 0));

      const result = await repository.findBySectionId(sectionId);
      expect(result.length).toBe(2);
      expect(result[0].orderIndex).toBe(0);
      expect(result[1].orderIndex).toBe(1);
    });
  });

  describe('delete', () => {
    it('should delete a lesson', async () => {
      const lesson = createDummyLesson();
      await repository.save(lesson);
      await repository.delete(lesson.id);

      const found = await repository.findById(lesson.id);
      expect(found).toBeNull();
    });
  });
});
