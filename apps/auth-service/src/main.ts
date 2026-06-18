import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.connectMicroservice<MicroserviceOptions>({ transport: Transport.TCP, options: { port: 4001 } });
  await app.startAllMicroservices();
  await app.listen(0);
  console.log('Auth service microservice listening (TCP:4001)');
}

bootstrap();
