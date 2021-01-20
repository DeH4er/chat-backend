import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

import { LoginDto } from './login.dto';
import { RegisterDto } from './register.dto';
import { TokenDto } from './token.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async login(loginDto: LoginDto): Promise<TokenDto> {
    const user = await this.userService.findOneByCredentials(loginDto);

    if (!user) {
      throw new BadRequestException('Username or password is invalid.');
    }

    const accessToken = await this.jwtService.signAsync(
      `${user.username}${user.id}`
    );

    return { accessToken };
  }

  async register(registerDto: RegisterDto): Promise<void> {
    await this.userService.create(registerDto);
  }
}
