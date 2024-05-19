import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { VerifyOTPType } from 'src/const/const';

@Entity('user_otp')
export class UserOtp {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unsigned: true })
  userId: number;

  @Column()
  otp: string;

  @OneToOne(() => User, (user) => user.userOtp)
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  user: User;

  @Column({ default: VerifyOTPType.REGISTER })
  type: VerifyOTPType;

  @Column({ type: 'timestamp' })
  expiredAt: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;
}
