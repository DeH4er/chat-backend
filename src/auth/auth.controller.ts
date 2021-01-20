import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { JoiPipe } from 'src/joi.pipe';

import { AuthService } from './auth.service';
import { LoginDto, LoginDtoSchema } from './login.dto';
import { RegisterDto, RegisterDtoSchema } from './register.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TokenDto } from './token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(new JoiPipe(LoginDtoSchema))
  login(@Body() credentials: LoginDto): Promise<TokenDto> {
    return this.authService.login(credentials);
  }

  @Post('register')
  @UsePipes(new JoiPipe(RegisterDtoSchema))
  register(@Body() registerDto: RegisterDto): Promise<void> {
    return this.authService.register(registerDto);
  }
}
