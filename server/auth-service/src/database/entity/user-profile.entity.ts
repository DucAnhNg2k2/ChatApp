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

@Entity('user_profile')
export class UserProfile {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unsigned: true, nullable: false, unique: true })
  userId: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @OneToOne(() => User, (user) => user.userProfile)
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  user: User;
}
