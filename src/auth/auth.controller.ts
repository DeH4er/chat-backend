import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { JoiPipe } from 'src/joi.pipe';

import { AuthService } from './auth.service';
import { LoginDto, LoginDtoSchema } from './login.dto';
import { RegisterDto, RegisterDtoSchema } from './register.dto';

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
    const jwtCookie = await this.authService.login(credentials);
    res.setHeader('Set-Cookie', jwtCookie);
    res.send();
  }

  @Post('logout')
  @UsePipes(new JoiPipe(LoginDtoSchema))
  async logout(@Res() res: Response): Promise<void> {
    const clearJwtCookie = await this.authService.logout();
    res.setHeader('Set-Cookie', clearJwtCookie);
    res.send();
  }

  @Public()
  @Post('register')
  @UsePipes(new JoiPipe(RegisterDtoSchema))
  register(@Body() registerDto: RegisterDto): Promise<void> {
    return this.authService.register(registerDto);
  }
}
