import { NestFactory } from '@nestjs/core';
import { ContactsModule } from './contacts.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ContactsModule);
  app.connectMicroservice<MicroserviceOptions>({ transport: Transport.TCP, options: { port: 4002 } });
  await app.startAllMicroservices();
  await app.listen(0);
  console.log('Contacts service microservice listening (TCP:4002)');
}

bootstrap();
