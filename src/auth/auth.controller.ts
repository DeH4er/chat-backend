import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { JoiPipe } from 'src/joi.pipe';

import { AuthService } from './auth.service';
import { JwtRefreshAuthGuard } from './jwt-refresh-auth.guard';
import { LoginDto, LoginDtoSchema } from './login.dto';
import { RegisterDto, RegisterDtoSchema } from './register.dto';
import { RequestWithUser } from './request-with-user.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @UsePipes(new JoiPipe(LoginDtoSchema))
  async login(
    @Body() credentials: LoginDto,
    @Res() res: Response
  ): Promise<void> {
    const jwtCookies = await this.authService.login(credentials);
    res.setHeader('Set-Cookie', [
      jwtCookies.accessTokenCookie,
      jwtCookies.refreshTokenCookie,
    ]);
    res.send();
  }

  @Post('logout')
  @UsePipes(new JoiPipe(LoginDtoSchema))
  async logout(
    @Res() res: Response,
    @Req() request: RequestWithUser
  ): Promise<void> {
    const clearJwtCookie = await this.authService.logout(request.user);
    res.setHeader('Set-Cookie', clearJwtCookie);
    res.send();
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithJwtToken({
      id: request.user.id,
      username: request.user.username,
    });
    request.res.setHeader('Set-Cookie', accessTokenCookie);
  }

  @Public()
  @Post('register')
  @UsePipes(new JoiPipe(RegisterDtoSchema))
  register(@Body() registerDto: RegisterDto): Promise<void> {
    return this.authService.register(registerDto);
  }
}
