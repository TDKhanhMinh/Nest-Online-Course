import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongooseOrderRepository } from './mongoose-order.repository';
import { OrderDocument, OrderSchema } from '@/database/schemas/order.schema';
import { OrderItemDocument, OrderItemSchema } from '@/database/schemas/order-item.schema';
import { rootMongooseTestModule, closeInMongodConnection } from '../test-utils/mongoose-test.module';
import { Order } from '@domain/order/entities/order.entity';
import { OrderItem } from '@domain/order/entities/order-item.entity';
import { OrderStatus } from '@shared/types/order-status.enum';
import { UniqueId } from '@shared/types/unique-id.vo';
import { Model } from 'mongoose';

describe('MongooseOrderRepository', () => {
  let repository: MongooseOrderRepository;
  let orderModel: Model<any>;
  let orderItemModel: Model<any>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: OrderDocument.name, schema: OrderSchema },
          { name: OrderItemDocument.name, schema: OrderItemSchema },
        ]),
      ],
      providers: [MongooseOrderRepository],
    }).compile();

    repository = module.get<MongooseOrderRepository>(MongooseOrderRepository);
    orderModel = module.get<Model<any>>(getModelToken(OrderDocument.name));
    orderItemModel = module.get<Model<any>>(getModelToken(OrderItemDocument.name));
  });

  beforeEach(async () => {
    await orderModel.deleteMany({});
    await orderItemModel.deleteMany({});
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await module.close();
  });

  const createDummyOrder = () => {
    return Order.create({
      studentId: UniqueId.generate(),
      totalAmount: 150.0,
      status: OrderStatus.PENDING,
    });
  };

  const createDummyOrderItem = (orderId: UniqueId) => {
    return OrderItem.create({
      orderId,
      courseId: UniqueId.generate(),
      courseTitle: 'Test Course',
      courseThumbnail: 'thumb.jpg',
      price: 150.0,
    });
  };

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('should save an order and its items', async () => {
      const order = createDummyOrder();
      const item = createDummyOrderItem(order.id);

      await repository.save(order, [item]);

      const foundOrder = await repository.findById(order.id);
      expect(foundOrder).toBeDefined();
      expect(foundOrder?.totalAmount).toBe(order.totalAmount);

      const items = await orderItemModel.find({ orderId: order.id.value }).exec();
      expect(items.length).toBe(1);
      expect(items[0].courseTitle).toBe(item.courseTitle);
    });
  });

  describe('findByStudentId', () => {
    it('should find orders by student id', async () => {
      const studentId = UniqueId.generate();
      const order = Order.create({
        studentId,
        totalAmount: 100,
        status: OrderStatus.SUCCESS,
      });

      await repository.save(order, []);

      const orders = await repository.findByStudentId(studentId);
      expect(orders.length).toBe(1);
      expect(orders[0].id.equals(order.id)).toBe(true);
    });
  });
});
