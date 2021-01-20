import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JoiPipe } from 'src/joi.pipe';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Channel } from './channel.entity';
import { ChannelService } from './channel.service';
import { CreateChannelDto, CreateChannelDtoSchema } from './create-channel.dto';

@Controller('channel')
@ApiBearerAuth()
export class ChannelController {
  constructor(private channelService: ChannelService) {}

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
}
