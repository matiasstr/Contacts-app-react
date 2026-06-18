import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactSchema } from './infrastructure/persistence/mongoose/contact.schema';
import { MongooseContactRepository } from './infrastructure/persistence/mongoose/mongoose-contact.repository';
import { ContactsMessageController } from './presentation/contacts.message-controller';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/contacts_app'), MongooseModule.forFeature([{ name: 'Contact', schema: ContactSchema }])],
  controllers: [ContactsMessageController],
  providers: [MongooseContactRepository],
  exports: [MongooseContactRepository],
})
export class ContactsModule {}
