import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
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

  async login(
    loginDto: LoginDto
  ): Promise<{ accessTokenCookie: string; refreshTokenCookie: string }> {
    const user = await this.userService.getByCredentials(loginDto);

    if (!user) {
      throw new BadRequestException('Username or password is invalid.');
    }

    const tokenPayload = { id: user.id, username: user.username };
    const accessTokenCookie = this.getCookieWithJwtToken(tokenPayload);
    const refreshToken = this.getCookieWithJwtRefreshToken(tokenPayload);
    await this.userService.setRefreshToken(refreshToken.token, user.id);
    return {
      accessTokenCookie,
      refreshTokenCookie: refreshToken.cookie,
    };
  }

  async logout(user: User): Promise<[string, string]> {
    await this.userService.removeRefreshToken(user.id);
    return this.getCookieForLogout();
  }

  async register(registerDto: RegisterDto): Promise<void> {
    await this.userService.create(registerDto);
  }

  getCookieWithJwtToken(tokenPayload: JwtPayload): string {
    const token = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION'),
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION'
    )}`;
  }

  getCookieWithJwtRefreshToken(
    tokenPayload: JwtPayload
  ): { cookie: string; token: string } {
    const token = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_EXPIRATION'
    )}`;
    return { cookie, token };
  }

  getCookieForLogout(): [string, string] {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
