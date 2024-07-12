import { UserProfileRepository } from './user-profile.repository';
import { UpdateMeDto } from './dto/update-me.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ChatService, PATTERN, UserReq } from 'src/const/const';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserProfileService {
  constructor(
    private userProfileRepository: UserProfileRepository,
    @Inject(ChatService.CHAT_SERVICE) private chatServiceClient: ClientProxy,
  ) {}

  async getProfile(user: UserReq) {
    return this.userProfileRepository.getProfile(user);
  }

  async updateProfile(user: UserReq, updateMeDto: UpdateMeDto) {
    await this.userProfileRepository.updateOrCreate(user, updateMeDto);
    // Update To Chat Service
    const result = await firstValueFrom(
      this.chatServiceClient.send(
        { cmd: PATTERN.MAP_TO_MEMBER_CHAT },
        { ...updateMeDto, userId: user.id },
      ),
    );
  }
}
