import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChannelController } from './channel.controller';
import { Channel } from './channel.entity';
import { ChannelService } from './channel.service';
import { Message } from './message.entity';
import { MessageService } from './message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, Message])],
  controllers: [ChannelController],
  providers: [ChannelService, MessageService],
})
export class ChannelModule {}
