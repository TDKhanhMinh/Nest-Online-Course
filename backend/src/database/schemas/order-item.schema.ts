import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class OrderItemDocument extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'OrderDocument' })
  orderId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'CourseDocument' })
  courseId: string;

  @Prop({ required: true })
  courseTitle: string;

  @Prop()
  courseThumbnail?: string;

  @Prop({ required: true, type: Number })
  price: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItemDocument);



