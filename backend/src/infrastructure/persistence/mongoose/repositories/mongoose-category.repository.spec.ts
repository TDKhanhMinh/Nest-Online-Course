import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongooseCategoryRepository } from './mongoose-category.repository';
import { CategoryDocument, CategorySchema } from '@/database/schemas/category.schema';
import { rootMongooseTestModule, closeInMongodConnection } from '../test-utils/mongoose-test.module';
import { Category } from '@domain/course/entities/category.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { Model } from 'mongoose';

describe('MongooseCategoryRepository', () => {
  let repository: MongooseCategoryRepository;
  let categoryModel: Model<any>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: CategoryDocument.name, schema: CategorySchema }]),
      ],
      providers: [MongooseCategoryRepository],
    }).compile();

    repository = module.get<MongooseCategoryRepository>(MongooseCategoryRepository);
    categoryModel = module.get<Model<any>>(getModelToken(CategoryDocument.name));
  });

  beforeEach(async () => {
    await categoryModel.deleteMany({});
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await module.close();
  });

  const createDummyCategory = (name = 'Test Category', slug = 'test-category') => {
    return Category.create({
      name,
      slug,
    });
  };

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('should save a category', async () => {
      const category = createDummyCategory();
      await repository.save(category);

      const found = await repository.findById(category.id);
      expect(found).toBeDefined();
      expect(found?.name).toBe(category.name);
    });
  });

  describe('findBySlug', () => {
    it('should find a category by slug', async () => {
      const category = createDummyCategory('Slug Category', 'slug-category');
      await repository.save(category);

      const found = await repository.findBySlug('slug-category');
      expect(found).toBeDefined();
      expect(found?.id.equals(category.id)).toBe(true);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      await repository.save(createDummyCategory('Category 1', 'c1'));
      await repository.save(createDummyCategory('Category 2', 'c2'));

      const result = await repository.findAll();
      expect(result.length).toBe(2);
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      const category = createDummyCategory();
      await repository.save(category);
      await repository.delete(category.id);

      const found = await repository.findById(category.id);
      expect(found).toBeNull();
    });
  });
});
