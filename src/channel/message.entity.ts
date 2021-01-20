import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Channel } from './channel.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @ManyToOne(() => User)
  author: User;

  @ManyToOne(() => Channel, (channel: Channel) => channel.messages)
  channel: Channel;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
