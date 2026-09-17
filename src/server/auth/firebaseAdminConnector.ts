import { initializeApp, cert, App, getApps } from 'firebase-admin/app';

export interface FirebaseAdminStatus {
  configured: boolean;
  initialized: boolean;
  projectId?: string;
  clientEmail?: string;
  error?: string;
}

export class FirebaseAdminConnector {
  private static app: App | null = null;

  /**
   * Evaluates if real Firebase credentials are provided
   */
  public static isConfigured(): boolean {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) return false;
    if (
      projectId.includes('your-firebase') ||
      clientEmail.includes('your-project') ||
      privateKey.includes('YOUR_FIREBASE_PRIVATE_KEY_HERE')
    ) {
      return false;
    }
    return true;
  }

  /**
   * Initializes Firebase Admin SDK safely
   */
  public static init(): App | null {
    if (this.app) return this.app;
    if (getApps().length > 0) {
      this.app = getApps()[0];
      return this.app;
    }
    if (!this.isConfigured()) return null;

    try {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (privateKey) {
        // Unescape escaped linebreaks if needed
        privateKey = privateKey.replace(/\\n/g, '\n');
      }

      this.app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });

      console.log(`[FirebaseAdminConnector] Initialized Firebase Admin for project: "${projectId}"`);
      return this.app;
    } catch (err: any) {
      console.warn(`[FirebaseAdminConnector] Initialization failed: ${err.message}. Using Sovereign Auth Gateway.`);
      this.app = null;
      return null;
    }
  }

  /**
   * Returns Firebase status without leaking keys
   */
  public static getStatus(): FirebaseAdminStatus {
    const configured = this.isConfigured();
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    return {
      configured,
      initialized: this.app !== null || getApps().length > 0,
      projectId: configured ? projectId : undefined,
      clientEmail: configured ? clientEmail : undefined,
      error: !configured ? 'Contains default placeholder (your-firebase-project-id) or missing keys' : undefined,
    };
  }
}
