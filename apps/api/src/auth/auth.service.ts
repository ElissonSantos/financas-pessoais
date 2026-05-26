import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(@Inject(JwtService) private readonly jwtService: JwtService) {}

  validatePin(pin: string): boolean {
    return pin === (process.env.APP_PIN ?? '1234');
  }

  createToken(): string {
    return this.jwtService.sign({ authenticated: true });
  }

  verifyToken(token: string): void {
    try {
      this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
