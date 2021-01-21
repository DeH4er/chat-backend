import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, Subject } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { User } from 'src/user/user.entity';
import { getManager, Repository } from 'typeorm';

import { Channel } from './channel.entity';
import { ChannelService } from './channel.service';
import { CreateMessageDto } from './create-message.dto';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
  messages$: Subject<Message> = new Subject();

  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    private channelService: ChannelService
  ) {}

  async create(
    createMessageDto: CreateMessageDto,
    channelId: number,
    authorId: number
  ): Promise<void> {
    await this.channelService.validateUserInChannel(channelId, authorId);
    const entityManager = getManager();
    const message = entityManager.create(Message, createMessageDto);
    message.channel = { id: channelId } as Channel;
    message.author = { id: authorId } as User;
    const createdMessage = await this.messageRepository.save(message);
    this.messages$.next(createdMessage);
  }

  getMessages$(channelId: number, userId: number): Observable<Message> {
    return from(
      this.channelService.validateUserInChannel(channelId, userId)
    ).pipe(
      switchMap(() => this.messages$.asObservable()),
      filter((m: Message) => m.channel.id === channelId)
    );
  }
}
