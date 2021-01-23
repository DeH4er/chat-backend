import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/auth/login.dto';
import { RegisterDto } from 'src/auth/register.dto';
import { getManager, Repository } from 'typeorm';

import { compareHashed } from '../utils';
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

  async getByCredentials(loginDto: LoginDto): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: loginDto.username })
      .addSelect('user.password')
      .getOne();

    if (!user) {
      return null;
    }

    const isPasswordSame = await compareHashed(
      loginDto.password,
      user.password
    );

    if (!isPasswordSame) {
      return null;
    }

    return user;
  }

  getById(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }
}
