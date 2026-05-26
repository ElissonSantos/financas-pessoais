import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { PinDto } from './pin.dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('auth/pin')
  loginWithPin(@Body() pinDto: PinDto) {
    if (!this.authService.validatePin(pinDto.pin)) {
      throw new UnauthorizedException('PIN incorreto.');
    }

    return {
      accessToken: this.authService.createToken(),
    };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me() {
    return { authenticated: true };
  }
}
