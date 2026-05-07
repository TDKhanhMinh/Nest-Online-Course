import { UserSchema } from '@/database/schemas/user.schema';
import { User } from '@domain/user/entities/user.entity';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@shared/types/role.enum';
import { Model } from 'mongoose';
import { closeInMongodConnection, rootMongooseTestModule } from '../test-utils/mongoose-test.module';
import { MongooseUserRepository } from './mongoose-user.repository';

describe('MongooseUserRepository', () => {
  let repository: MongooseUserRepository;
  let userModel: Model<any>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      ],
      providers: [MongooseUserRepository],
    }).compile();

    repository = module.get<MongooseUserRepository>(MongooseUserRepository);
    userModel = module.get<Model<any>>(getModelToken('User'));
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await module.close();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('should save a user', async () => {
      const user = User.create({
        fullName: 'Test User',
        email: 'test@example.com',
        passwordHash: 'hashed',
        roles: [Role.STUDENT],
      });

      await repository.save(user);

      const foundUser = await repository.findById(user.id);
      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe(user.email);
      expect(foundUser?.fullName).toBe(user.fullName);
    });

    it('should update an existing user', async () => {
      const user = User.create({
        fullName: 'Test User',
        email: 'test@example.com',
        passwordHash: 'hashed',
        roles: [Role.STUDENT],
      });

      await repository.save(user);

      user.updateFullName('Updated Name');
      await repository.save(user);

      const foundUser = await repository.findById(user.id);
      expect(foundUser?.fullName).toBe('Updated Name');
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const user = User.create({
        fullName: 'Email User',
        email: 'email@example.com',
        passwordHash: 'hashed',
        roles: [Role.STUDENT],
      });

      await repository.save(user);

      const foundUser = await repository.findByEmail('email@example.com');
      expect(foundUser).toBeDefined();
      expect(foundUser?.id.equals(user.id)).toBe(true);
    });

    it('should return null if user not found', async () => {
      const foundUser = await repository.findByEmail('nonexistent@example.com');
      expect(foundUser).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return a list of users and total count', async () => {
       // Clear existing users if any or just add new ones
       const user1 = User.create({ fullName: 'User 1', email: 'user1@example.com', passwordHash: 'h', roles: [Role.STUDENT] });
       const user2 = User.create({ fullName: 'User 2', email: 'user2@example.com', passwordHash: 'h', roles: [Role.STUDENT] });
       
       await repository.save(user1);
       await repository.save(user2);

       const result = await repository.findAll(10, 0);
       expect(result.total).toBeGreaterThanOrEqual(2);
       expect(result.users.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const user = User.create({
        fullName: 'Delete Me',
        email: 'delete@example.com',
        passwordHash: 'hashed',
        roles: [Role.STUDENT],
      });

      await repository.save(user);
      await repository.delete(user.id);

      const foundUser = await repository.findById(user.id);
      expect(foundUser).toBeNull();
    });
  });
});
