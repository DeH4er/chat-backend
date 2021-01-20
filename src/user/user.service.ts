import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/auth/login.dto';
import { RegisterDto } from 'src/auth/register.dto';
import { getManager, Repository } from 'typeorm';

import { hashPassword } from '../utils';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const userFound = await this.userRepository.findOne({
      username: registerDto.username,
    });

    if (!!userFound) {
      throw new BadRequestException('User already exists');
    }

    const entityManager = getManager();
    const obj = entityManager.create(User, registerDto);
    return this.userRepository.save(obj);
  }

  findOneByCredentials(loginDto: LoginDto): Promise<User> {
    return this.userRepository.findOne({
      username: loginDto.username,
      password: hashPassword(loginDto.password),
    });
  }
}
