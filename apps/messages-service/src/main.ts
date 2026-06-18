import { NestFactory } from '@nestjs/core';
import { MessagesModule } from './messages.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(MessagesModule);
  app.connectMicroservice<MicroserviceOptions>({ transport: Transport.TCP, options: { port: 4003 } });
  await app.startAllMicroservices();
  await app.listen(0);
  console.log('Messages service microservice listening (TCP:4003)');
}

bootstrap();
