import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ContactsController } from './contacts.controller';

@Module({
  imports: [ClientsModule.register([{ name: 'CONTACTS_SERVICE', transport: Transport.TCP, options: { port: 4002 } }])],
  controllers: [ContactsController],
})
export class ContactsModule {}
