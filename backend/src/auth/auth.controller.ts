import { Controller, Get, Logger, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { CutsomUser } from '../types';

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
    const token = await this.authService.signIn(req.user);
    const user = req.user as CutsomUser;

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.cookie('access_token', token, {
      maxAge: 864000000,
      sameSite: false,
      secure: false,
      httpOnly: true
    });
    console.log(user.picture)
    res.redirect(`http://localhost:5173/#/callback/${user.email}`)
  }
}
