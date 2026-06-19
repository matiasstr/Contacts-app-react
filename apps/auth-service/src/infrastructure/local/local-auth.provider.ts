import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { MongooseUserRepository } from '../persistence/mongoose/mongoose-user.repository';

@Injectable()
export class LocalAuthProvider {
  constructor(private readonly repo: MongooseUserRepository) {}

  async register(payload: any) {
    const existing = await this.repo.findByEmail(payload.email);
    if (existing) return { status: 409, message: 'Email already exists' };
    const hash = await argon2.hash(payload.password);
    const user = await this.repo.create({ email: payload.email, displayName: payload.displayName, passwordHash: hash, authProvider: 'local' });
    const token = jwt.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET || 'dev_secret_change_me');
    return { user, token };
  }

  async login(payload: any) {
    const user: any = await this.repo.findByEmail(payload.email);
    if (!user) return { status: 401, message: 'Invalid credentials' };
    if (!user.passwordHash) return { status: 401, message: 'Invalid credentials' };
    const ok = await argon2.verify(user.passwordHash, payload.password);
    if (!ok) return { status: 401, message: 'Invalid credentials' };
    const token = jwt.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET || 'dev_secret_change_me');
    return { user, token };
  }

  async getCurrent(payload: any) {
    // payload.token expected
    try {
      const decoded: any = jwt.verify(payload.token, process.env.JWT_SECRET || 'dev_secret_change_me');
      const user = await this.repo.findByEmail(decoded.email);
      return user;
    } catch (e) {
      return null;
    }
  }
}
