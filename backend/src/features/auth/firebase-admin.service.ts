import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  cert,
  getApps,
  initializeApp,
  ServiceAccount,
} from 'firebase-admin/app';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FIREBASE_CREDENTIALS_PATH_ENV } from './auth.constants';

/** Initializes Firebase Admin SDK and exposes token verification. */
@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  /** Loads service account credentials and initializes the Firebase app. */
  onModuleInit(): void {
    if (getApps().length > 0) {
      return;
    }

    const credentialsPath = this.configService.get<string>(
      FIREBASE_CREDENTIALS_PATH_ENV,
    );
    if (!credentialsPath) {
      throw new Error(
        `Missing required env var: ${FIREBASE_CREDENTIALS_PATH_ENV}`,
      );
    }

    const absolutePath = resolve(credentialsPath);
    const serviceAccount = JSON.parse(
      readFileSync(absolutePath, 'utf8'),
    ) as ServiceAccount;

    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  /**
   * Verifies a Firebase ID token issued by the client SDK.
   * @param idToken - Firebase ID token from the frontend.
   */
  async verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    return getAuth().verifyIdToken(idToken);
  }
}
