import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers.authorization?.split(' ')[1];
    if (!auth) return false;
    try {
      const decoded = await admin.auth().verifyIdToken(auth);
      req.user = { uid: decoded.uid, email: decoded.email };
      return true;
    } catch (e) {
      return false;
    }
  }
}
