import { BadRequestException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'test' })],
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getByCredentials(credentials: LoginDto) {
              if (credentials.username === 'admin') {
                return new User();
              }
            },
          },
        },
      ],
    }).compile();

    authService = app.get<AuthService>(AuthService);
  });

  it('should create', () => {
    expect(authService).toBeTruthy();
  });

  it('should login when user found', async () => {
    const token = await authService.login({ username: 'admin', password: '' });
    expect(token).toBeTruthy();
  });

  it('should error on login when user is not found', async () => {
    expect(
      authService.login({ username: '', password: '' })
    ).rejects.toThrowError(BadRequestException);
  });
});
