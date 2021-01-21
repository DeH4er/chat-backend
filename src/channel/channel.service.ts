import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { getConnection, getManager, Repository } from 'typeorm';

import { Channel } from './channel.entity';
import { CreateChannelDto } from './create-channel.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel) private channelRepository: Repository<Channel>
  ) {}

  getAll(): Promise<Channel[]> {
    return this.channelRepository.find();
  }

  create(
    createChannelDto: CreateChannelDto,
    creatorId: number
  ): Promise<Channel> {
    const channelManager = getManager();
    const channel = channelManager.create(Channel);
    channel.name = createChannelDto.name;
    channel.messages = [];
    channel.users = [{ id: creatorId } as User];
    return this.channelRepository.save(channel);
  }

  async join(channelId: number, userId: number): Promise<void> {
    const channelFound = await this.getById(channelId);

    if (!channelFound) {
      throw new BadRequestException(`Channel ${channelId} hasn't found.`);
    }

    const channel = await this.getByIdAndUser(channelId, userId);

    if (!!channel) {
      throw new BadRequestException(
        `Channel ${channelId} already has a User ${userId}`
      );
    }

    await getConnection()
      .createQueryBuilder()
      .relation(Channel, 'users')
      .of(channelFound)
      .add({ id: userId } as User);
  }

  async leave(channelId: number, userId: number): Promise<void> {
    const channel = await this.getByIdAndUser(channelId, userId);

    if (!channel) {
      throw new BadRequestException(
        `Channel ${channelId} with User ${userId} hasn't found`
      );
    }

    await getConnection()
      .createQueryBuilder()
      .relation(Channel, 'users')
      .of(channel)
      .remove({ id: userId } as User);
  }

  async getByIdWithUsers(channelId: number): Promise<Channel> {
    const channelFound = await this.channelRepository.findOne(channelId, {
      relations: ['users'],
    });

    if (!channelFound) {
      throw new BadRequestException(`Channel ${channelId} hasn't found`);
    }

    return channelFound;
  }

  async getById(channelId: number): Promise<Channel> {
    const channelFound = await this.channelRepository.findOne(channelId);

    if (!channelFound) {
      throw new BadRequestException(`Channel ${channelId} hasn't found`);
    }

    return channelFound;
  }

  async getByIdAndUser(channelId: number, userId: number): Promise<Channel> {
    const channelFound = await getConnection()
      .createQueryBuilder(Channel, 'channel')
      .innerJoin('channel.users', 'user')
      .where('channel.id = :channelId', { channelId })
      .andWhere('user.id = :userId', { userId })
      .getOne();

    return channelFound;
  }

  async validateUserInChannel(channelId: number, authorId: number) {
    const channel = await this.getByIdAndUser(channelId, authorId);

    if (!channel) {
      throw new BadRequestException(
        `User ${authorId} is not in Channel ${channelId}`
      );
    }
  }
}
