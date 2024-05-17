import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthRegisterEmailDto } from './dto/auth-register-email.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() authRegisterEmailDto: AuthRegisterEmailDto) {
    return this.authService.register(authRegisterEmailDto);
  }

  @Post('login')
  login() {
    // return this.authService.login();
  }
}
