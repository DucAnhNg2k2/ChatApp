import { AuthRepository } from './auth.repository';
import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { QueueService } from '../queue/queue.service';
import { AuthRegisterEmailDto } from './dto/auth-register-email.dto';
import { UserType } from 'src/const/const';

@Injectable()
export class AuthService {
  constructor(
    private readonly queueService: QueueService,
    private readonly authRepository: AuthRepository,
  ) {}

  async register(authRegisterEmailDto: AuthRegisterEmailDto) {
    const findOneByEmail = await this.authRepository.findOneByEmail(
      authRegisterEmailDto.email,
    );
    if (findOneByEmail) {
      throw new BadRequestException('Email already exists');
    }

    authRegisterEmailDto.type = UserType.EMAIL;
    const user = await this.authRepository.insert(authRegisterEmailDto);
    if (!user) {
      throw new BadRequestException('Failed to register user');
    }
    this.queueService.sendMain(user.id);

    return 'User Registered';
  }
}
