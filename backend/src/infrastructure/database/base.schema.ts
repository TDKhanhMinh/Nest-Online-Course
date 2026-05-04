import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Base Mongoose Schema cung cấp _id (string UUID), createdAt, updatedAt.
 * Các schema cụ thể kế thừa class này và thêm @Schema({ timestamps: true }).
 */
@Schema({ _id: false })
export class BaseMongooseSchema extends Document<string> {
  @Prop({ type: String, required: true })
  declare _id: string;
}
