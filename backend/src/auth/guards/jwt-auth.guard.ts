import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: any, user: TUser, info: any, _context: ExecutionContext): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('Bạn chưa đăng nhập');
    }
    return user;
  }
}
