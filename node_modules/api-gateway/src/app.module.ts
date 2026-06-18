import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './contacts/contacts.module';
import { WsGateway } from './ws/ws.gateway';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'AUTH_SERVICE', transport: Transport.TCP, options: { port: 4001 } },
      { name: 'CONTACTS_SERVICE', transport: Transport.TCP, options: { port: 4002 } },
      { name: 'MESSAGES_SERVICE', transport: Transport.TCP, options: { port: 4003 } },
    ]),
    AuthModule,
    ContactsModule,
    
  ],
  providers: [WsGateway],
})
export class AppModule {}
