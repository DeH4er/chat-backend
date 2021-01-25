import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { hash } from '../utils';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false, nullable: true })
  refreshToken?: string;

  @BeforeInsert()
  async hash() {
    this.password = await hash(this.password);

    if (this.refreshToken) {
      this.refreshToken = await hash(this.refreshToken);
    }
  }
}
