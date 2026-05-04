import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Role } from '@/common/types/role.enum';

@Schema({ timestamps: true })
export class UserDocument extends Document {

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role;
}

export const UserSchema: MongooseSchema = SchemaFactory.createForClass(UserDocument);
