import { Bucket } from '@google-cloud/storage';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage, Storage } from 'firebase-admin/storage';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private serviceAccount = require('../../../firebase.json');
  private storageBucket = 'gs://chatapp-f0f95.appspot.com';

  private storage: Storage = null;
  private bucket: Bucket = null;
  constructor() {}

  onModuleInit() {
    initializeApp({
      credential: cert(this.serviceAccount),
      storageBucket: '',
    });
    this.storage = getStorage();
    this.bucket = this.storage.bucket(this.storageBucket);
    console.log('[FirebaseService] Initialized');
  }

  async uploadFile(file: Express.Multer.File) {
    const fullPath = `images/${randomUUID()}`;
    const bucketFile = this.bucket.file(fullPath);

    await bucketFile.save(file.buffer, {
      contentType: file.mimetype,
    });

    const [url] = await bucketFile.getSignedUrl({
      action: 'read',
      expires: '01-01-2050',
    });

    return url;
  }

  async downloadFile(filename: string) {
    const file = this.bucket.file(`images/${filename}`);
    const stream = file.createReadStream();
    return stream;
  }
}
