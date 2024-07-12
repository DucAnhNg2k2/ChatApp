import { Body, Controller, Get, Put } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { User } from 'src/decorators/user.decorator';
import { UserReq } from 'src/const/const';
import { UpdateMeDto } from './dto/update-me.dto';

@Controller('user-profile')
export class UserProfileController {
  constructor(private userProfileService: UserProfileService) {}

  @Get()
  async getProfile(@User() user: UserReq) {
    return this.userProfileService.getProfile(user);
  }

  @Put()
  async updateProfile(@User() user: UserReq, @Body() updateMeDto: UpdateMeDto) {
    return this.userProfileService.updateProfile(user, updateMeDto);
  }
}
