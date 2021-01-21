import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { getManager, Repository } from 'typeorm';

import { Channel } from './channel.entity';
import { Message } from './message.entity';
import { WriteMessageDto } from './write-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>
  ) {}

  writeMessage(
    writeMessageDto: WriteMessageDto,
    authorId: number,
    channelId: number
  ): Promise<Message> {
    const entityManager = getManager();
    const message = entityManager.create(Message, writeMessageDto);
    message.channel = { id: channelId } as Channel;
    message.author = { id: authorId } as User;
    return this.messageRepository.save(message);
  }
}
