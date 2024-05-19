import { OmitType, PickType } from '@nestjs/swagger';
import { VerifyOtpDto } from './verify-otp.dto';

export class ResendOtpDto extends PickType(VerifyOtpDto, ['email', 'type']) {}
