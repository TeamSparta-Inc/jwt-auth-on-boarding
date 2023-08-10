import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RefreshToken extends Document {
  @Prop()
  refreshToken: string;

  @Prop()
  userId: string;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
