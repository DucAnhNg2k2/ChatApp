import { SetMetadata } from '@nestjs/common';

export const PUBLIC_ENDPOINT = 'public_endpoint';
export const PublicEndPont = (isPublicEndpoint: boolean = true) =>
  SetMetadata(PUBLIC_ENDPOINT, isPublicEndpoint);
