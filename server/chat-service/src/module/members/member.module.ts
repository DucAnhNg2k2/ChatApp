import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberSchema, Members } from 'src/schema/member.schema';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Members.name, schema: MemberSchema }],
      'chat-service',
    ),
  ],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule {}
