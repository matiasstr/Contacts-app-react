import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './infrastructure/persistence/mongoose/user.schema';
import { MongooseUserRepository } from './infrastructure/persistence/mongoose/mongoose-user.repository';
import { AuthMessageController } from './presentation/auth.message-controller';
import { LocalAuthProvider } from './infrastructure/local/local-auth.provider';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/contacts_app'), MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [AuthMessageController],
  providers: [MongooseUserRepository, LocalAuthProvider],
  exports: [MongooseUserRepository],
})
export class AuthModule {}
