import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MongooseUserRepository } from '../infrastructure/persistence/mongoose/mongoose-user.repository';
import { LocalAuthProvider } from '../infrastructure/local/local-auth.provider';

@Controller()
export class AuthMessageController {
  constructor(private readonly repo: MongooseUserRepository, private readonly local: LocalAuthProvider) {}

  @MessagePattern('auth.registerLocalUser')
  async register(payload: any) {
    return this.local.register(payload);
  }

  @MessagePattern('auth.loginLocalUser')
  async login(payload: any) {
    return this.local.login(payload);
  }

  @MessagePattern('auth.getCurrentUser')
  async getCurrent(payload: any) {
    return this.local.getCurrent(payload);
  }

  @MessagePattern('auth.syncFirebaseUser')
  async syncFirebase(payload: any) {
    // Minimal sync: persist profile if not exists
    return this.repo.syncFirebaseUser(payload);
  }
}
