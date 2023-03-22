import { Controller, Get, HttpStatus, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) { }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth() {
  }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    this.logger.debug(req.user)
    const token = await this.authService.singIn(req.user);

    res.cookie('access_token', token, {
      maxAge: 300000,
      sameSite: false,
      secure: false,
      httpOnly: true
    });

    return res.send(HttpStatus.OK);
  }
}
