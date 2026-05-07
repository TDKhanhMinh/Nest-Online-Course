import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class CartDocument extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'UserDocument', unique: true })
  studentId: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'CourseDocument' }], default: [] })
  courseIds: string[];
}

export const CartSchema = SchemaFactory.createForClass(CartDocument);



