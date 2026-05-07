import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Role } from '@shared/types/role.enum';

@Schema({ timestamps: true })
export class UserDocument extends Document {

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: [String], enum: Role, default: [Role.STUDENT] })
  roles: Role[];

  @Prop({ type: String })
  avatarUrl?: string;

  @Prop({ type: String })
  bio?: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);



