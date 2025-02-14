//auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.usersService.findByEmail(body.email);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    const isPasswordValid = await user.comparePassword(body.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    return this.authService.login(user);
  }
}
