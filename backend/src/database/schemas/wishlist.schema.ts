import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class WishlistDocument extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'UserDocument' })
  userId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'CourseDocument' })
  courseId: string;
}

export const WishlistSchema = SchemaFactory.createForClass(WishlistDocument);

WishlistSchema.index({ userId: 1, courseId: 1 }, { unique: true });



