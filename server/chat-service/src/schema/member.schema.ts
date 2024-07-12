import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MembersDocument = HydratedDocument<Members>;

@Schema({ timestamps: true })
export class Members {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  avatar: string;

  @Prop()
  userId: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ default: undefined })
  joinAt: Date;

  @Prop({ default: undefined })
  leftAt: Date;
}

export const MemberSchema = SchemaFactory.createForClass(Members);
