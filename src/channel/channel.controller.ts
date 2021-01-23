import {
  Body,
  Controller,
  Get,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  MessageEvent,
  Param,
  ParseIntPipe,
  Post,
  Request,
  Sse,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JoiPipe } from 'src/joi.pipe';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Channel } from './channel.entity';
import { ChannelService } from './channel.service';
import { CreateChannelDto, CreateChannelDtoSchema } from './create-channel.dto';
import { CreateMessageDto, CreateMessageDtoSchema } from './create-message.dto';
import { Message } from './message.entity';
import { MessageService } from './message.service';

@Controller('api/channel')
@ApiBearerAuth()
export class ChannelController {
  constructor(
    private channelService: ChannelService,
    private messageService: MessageService
  ) {}

  @Get()
  getAll(): Promise<Channel[]> {
    return this.channelService.getAll();
  }

  @Post()
  @UsePipes(new JoiPipe(CreateChannelDtoSchema))
  async create(
    @Request() req: any,
    @Body() createChannelDto: CreateChannelDto
  ) {
    return this.channelService.create(createChannelDto, req.user.id);
  }

  @Post(':id/join')
  join(
    @Request() req: any,
    @Param('id', ParseIntPipe) channelId: number
  ): Promise<void> {
    return this.channelService.join(channelId, req.user.id);
  }

  @Post(':id/leave')
  leave(
    @Request() req: any,
    @Param('id', ParseIntPipe) channelId: number
  ): Promise<void> {
    return this.channelService.leave(channelId, req.user.id);
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) channelId: number): Promise<Channel> {
    return this.channelService.getByIdWithUsers(channelId);
  }

  @Post(':id/message')
  @UsePipes(new JoiPipe(CreateMessageDtoSchema))
  createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req: any,
    @Param('id', ParseIntPipe) channelId: number
  ): Promise<void> {
    return this.messageService.create(createMessageDto, channelId, req.user.id);
  }

  @Sse(':id/message-sse')
  getMessages$(
    @Request() req: any,
    @Param('id', ParseIntPipe) channelId: number
  ): Observable<MessageEvent> {
    return this.messageService.getMessages$(channelId, req.user.id).pipe(
      map((message: Message) => {
        return {
          data: message,
        };
      })
    );
  }
}
