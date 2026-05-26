import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers?: Record<string, string | undefined> }>();
    const authorization = request.headers?.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const token = authorization.slice('Bearer '.length).trim();
    this.authService.verifyToken(token);

    return true;
  }
}
