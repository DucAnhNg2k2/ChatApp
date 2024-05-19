import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_token')
export class UserToken {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unsigned: true })
  userId: number;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @ManyToOne(() => User, (user) => user.userTokens)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @Column()
  expiredAccessTokenAt: Date;

  @Column()
  expiredRefreshTokenAt: Date;
}
