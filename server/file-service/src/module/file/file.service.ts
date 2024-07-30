import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class FileService {
  constructor(private firebaseService: FirebaseService) {}

  async uploadFile(file: Express.Multer.File) {
    return this.firebaseService.uploadFile(file);
  }

  async downloadFile(filename: string) {
    return this.firebaseService.downloadFile(filename);
  }
}
