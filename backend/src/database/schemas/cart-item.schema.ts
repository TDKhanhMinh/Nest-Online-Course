import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class CartItemDocument extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'UserDocument' })
  userId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'CourseDocument' })
  courseId: string;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItemDocument);

CartItemSchema.index({ userId: 1, courseId: 1 }, { unique: true });



