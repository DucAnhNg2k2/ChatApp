import { UserType } from 'src/const/const';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserOtp } from './user-otp.entity';
import { UserToken } from './user-token.entity';

@Entity('user')
export class User {
  @PrimaryColumn('bigint', { unsigned: true, generated: true })
  @Generated('increment')
  id: number;

  @Column({ nullable: true })
  phone: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  facebookId: string;

  @Column({ nullable: true })
  googleId: string;

  @Column()
  type: UserType;

  @OneToOne(() => UserOtp, (userOtp) => userOtp.user)
  userOtp: UserOtp;

  @OneToMany(() => UserToken, (userToken) => userToken.user)
  userTokens: UserToken[];

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: string;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: string;
}
