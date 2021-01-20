import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { getManager, Repository } from 'typeorm';

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

  create(createChannelDto: CreateChannelDto, creator: User): Promise<Channel> {
    const channelManager = getManager();
    const channel = channelManager.create(Channel);
    channel.name = createChannelDto.name;
    channel.messages = [];
    channel.users = [creator];
    return this.channelRepository.save(channel);
  }

  get(id: number): Promise<Channel> {
    const channelFound = this.channelRepository.findOne({ id });
    if (!channelFound) {
      throw new BadRequestException(`Channel ${id} isn't found`);
    }

    return channelFound;
  }
}
