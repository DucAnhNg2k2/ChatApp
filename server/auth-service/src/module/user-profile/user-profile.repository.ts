import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserReq } from 'src/const/const';
import { UserProfile } from 'src/database/entity/user-profile.entity';
import { Repository } from 'typeorm';
import { UpdateMeDto } from './dto/update-me.dto';

@Injectable()
export class UserProfileRepository {
  constructor(
    @InjectRepository(UserProfile)
    private usersRepository: Repository<UserProfile>,
  ) {}

  async updateOrCreate(user: UserReq, updateMe: UpdateMeDto) {
    const userId = user.id;
    const userProfile = await this.usersRepository.findOne({
      where: {
        userId,
      },
    });
    if (userProfile) {
      return await this.usersRepository.update(userProfile.id, {
        name: updateMe.name,
        address: updateMe.address,
        avatar: updateMe.avatar,
      });
    }
    return await this.usersRepository.insert({
      userId,
      name: updateMe.name,
      address: updateMe.address,
      avatar: updateMe.avatar,
    });
  }

  async getProfile(user: UserReq) {
    return await this.usersRepository.findOne({
      where: {
        userId: user.id,
      },
    });
  }
}
