import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongooseReviewRepository } from './mongoose-review.repository';
import { ReviewDocument, ReviewSchema } from '@/database/schemas/review.schema';
import { rootMongooseTestModule, closeInMongodConnection } from '../test-utils/mongoose-test.module';
import { Review } from '@domain/course/entities/review.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { Model } from 'mongoose';

describe('MongooseReviewRepository', () => {
  let repository: MongooseReviewRepository;
  let reviewModel: Model<any>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: ReviewDocument.name, schema: ReviewSchema }]),
      ],
      providers: [MongooseReviewRepository],
    }).compile();

    repository = module.get<MongooseReviewRepository>(MongooseReviewRepository);
    reviewModel = module.get<Model<any>>(getModelToken(ReviewDocument.name));
  });

  beforeEach(async () => {
    await reviewModel.deleteMany({});
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await module.close();
  });

  const createDummyReview = (courseId = UniqueId.generate(), studentId = UniqueId.generate(), rating = 5) => {
    return Review.create({
      courseId,
      studentId,
      rating,
      comment: 'Great course!',
    });
  };

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('should save a review', async () => {
      const review = createDummyReview();
      await repository.save(review);

      const found = await repository.findById(review.id);
      expect(found).toBeDefined();
      expect(found?.rating).toBe(review.rating);
    });
  });

  describe('findByCourseId', () => {
    it('should find reviews by course id', async () => {
      const courseId = UniqueId.generate();
      await repository.save(createDummyReview(courseId, UniqueId.generate(), 5));
      await repository.save(createDummyReview(courseId, UniqueId.generate(), 4));

      const result = await repository.findByCourseId(courseId);
      expect(result.length).toBe(2);
    });
  });

  describe('delete', () => {
    it('should delete a review', async () => {
      const review = createDummyReview();
      await repository.save(review);
      await repository.delete(review.id);

      const found = await repository.findById(review.id);
      expect(found).toBeNull();
    });
  });
});
