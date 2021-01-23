import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

import { JwtPayload } from './jwt-payload';
import { LoginDto } from './login.dto';
import { RegisterDto } from './register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.userService.getByCredentials(loginDto);

    if (!user) {
      throw new BadRequestException('Username or password is invalid.');
    }

    return this.getCookieWithJwtToken({ id: user.id, username: user.username });
  }

  async logout(): Promise<string> {
    return Promise.resolve(this.getCookieForLogout());
  }

  async register(registerDto: RegisterDto): Promise<void> {
    await this.userService.create(registerDto);
  }

  getCookieWithJwtToken(tokenPayload: JwtPayload): string {
    const token = this.jwtService.sign(tokenPayload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION'
    )}`;
  }

  getCookieForLogout(): string {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
