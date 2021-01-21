import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { User } from 'src/user/user.entity';
import { getManager, Repository } from 'typeorm';

import { Channel } from './channel.entity';
import { CreateMessageDto } from './create-message.dto';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
  messages$: Subject<Message> = new Subject();

  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>
  ) {}

  async create(
    createMessageDto: CreateMessageDto,
    channelId: number,
    authorId: number
  ): Promise<void> {
    const entityManager = getManager();
    const message = entityManager.create(Message, createMessageDto);
    message.channel = { id: channelId } as Channel;
    message.author = { id: authorId } as User;
    const createdMessage = await this.messageRepository.save(message);
    this.messages$.next(createdMessage);
  }

  getMessages$(channelId: number): Observable<Message> {
    return this.messages$
      .asObservable()
      .pipe(filter((m: Message) => m.channel.id == channelId));
  }
}
