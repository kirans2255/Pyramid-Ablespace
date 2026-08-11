import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  avatar?: string;

  @Prop({ default: 'Admin' })
  role: string;

  @Prop({ default: 'Designer' })
  title?: string;

  @Prop()
  username?: string;

  @Prop({ default: false })
  isGuest: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
