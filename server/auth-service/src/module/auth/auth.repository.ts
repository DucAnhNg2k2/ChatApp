import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { Repository } from 'typeorm';
import { AuthRegisterEmailDto } from './dto/auth-register-email.dto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  insert(autoRegisterEmailDto: AuthRegisterEmailDto): Promise<User> {
    return this.usersRepository.save({
      email: autoRegisterEmailDto.email,
      password: autoRegisterEmailDto.password,
      type: autoRegisterEmailDto.type,
    });
  }

  updateActive(id: number): Promise<User> {
    return this.usersRepository.save({
      id,
      isActive: true,
    });
  }
}
