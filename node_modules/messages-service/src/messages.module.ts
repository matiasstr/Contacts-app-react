import { Module } from '@nestjs/common';
import { MessagesController } from './presentation/messages.message-controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './infrastructure/persistence/mongoose/message.schema';
import { MongooseMessageRepository } from './infrastructure/persistence/mongoose/mongoose-message.repository';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/contacts_app'), MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }])],
  controllers: [MessagesController],
  providers: [MongooseMessageRepository],
  exports: [MongooseMessageRepository],
})
export class MessagesModule {}
