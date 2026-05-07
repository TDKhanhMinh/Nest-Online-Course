import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongooseSectionRepository } from './mongoose-section.repository';
import { SectionDocument, SectionSchema } from '@/database/schemas/section.schema';
import { rootMongooseTestModule, closeInMongodConnection } from '../test-utils/mongoose-test.module';
import { Section } from '@domain/course/entities/section.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { Model } from 'mongoose';

describe('MongooseSectionRepository', () => {
  let repository: MongooseSectionRepository;
  let sectionModel: Model<any>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: SectionDocument.name, schema: SectionSchema }]),
      ],
      providers: [MongooseSectionRepository],
    }).compile();

    repository = module.get<MongooseSectionRepository>(MongooseSectionRepository);
    sectionModel = module.get<Model<any>>(getModelToken(SectionDocument.name));
  });

  beforeEach(async () => {
    await sectionModel.deleteMany({});
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await module.close();
  });

  const createDummySection = (courseId = UniqueId.generate(), title = 'Test Section', orderIndex = 0) => {
    return Section.create({
      courseId,
      title,
      orderIndex,
    });
  };

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('should save a section', async () => {
      const section = createDummySection();
      await repository.save(section);

      const found = await repository.findById(section.id);
      expect(found).toBeDefined();
      expect(found?.title).toBe(section.title);
    });
  });

  describe('findByCourseId', () => {
    it('should find sections by course id', async () => {
      const courseId = UniqueId.generate();
      await repository.save(createDummySection(courseId, 'Section 1', 1));
      await repository.save(createDummySection(courseId, 'Section 2', 0));

      const result = await repository.findByCourseId(courseId);
      expect(result.length).toBe(2);
      expect(result[0].orderIndex).toBe(0);
      expect(result[1].orderIndex).toBe(1);
    });
  });

  describe('delete', () => {
    it('should delete a section', async () => {
      const section = createDummySection();
      await repository.save(section);
      await repository.delete(section.id);

      const found = await repository.findById(section.id);
      expect(found).toBeNull();
    });
  });
});
