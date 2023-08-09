import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  password: string;
}

export const UserModel = SchemaFactory.createForClass(User);
