import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers.authorization?.split(' ')[1];
    if (!auth) return false;
    try {
      const payload = jwt.verify(auth, process.env.JWT_SECRET || 'dev_secret_change_me');
      req.user = payload;
      return true;
    } catch (e) {
      return false;
    }
  }
}
