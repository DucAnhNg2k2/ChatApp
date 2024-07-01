import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthService, PATTERN } from './const/const';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject(AuthService.AUTH_SERVICE) private authServiceClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async verifyHeaderToken(token: string) {
    const pattern = { cmd: PATTERN.VERIFY_AUTH };
    const result = firstValueFrom(this.authServiceClient.send(pattern, token));
    return result
      .then((res) => res)
      .catch((err) => {
        console.log(err);
      });
  }
}
