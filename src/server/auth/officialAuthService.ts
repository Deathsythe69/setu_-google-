import crypto from 'crypto';
import { MongoDbConnector } from '../storage/mongoDbConnector.js';

export interface OfficialCredential {
  email: string;
  role: 'policymaker' | 'governance_officer' | 'admin';
  department: string;
  passwordHash: string;
  plainPasswordSnippet?: string; // Stored only for admin initial dispatch
  createdAt: string;
  createdBy: string;
  lastLogin?: string;
  isActive: boolean;
}

export class OfficialAuthService {
  private static localCredentials: Map<string, OfficialCredential> = new Map();
  private static initialized = false;

  private static hashPassword(password: string): string {
    const secret = process.env.JWT_SECRET || 'setu_brics_secure_jwt_secret_key_change_in_production_2026';
    return crypto.createHmac('sha256', secret).update(password.trim()).digest('hex');
  }

  /**
   * Initializes default seed credentials (Super Admin and Initial Municipal Official)
   */
  public static async initialize(): Promise<void> {
    if (this.initialized) return;

    // 1. Super Admin Account (debasispanigrahi7864@gmail.com)
    const adminEmail = (process.env.ADMIN_EMAILS || 'debasispanigrahi7864@gmail.com').toLowerCase().split(',')[0].trim();
    const adminPass = process.env.ADMIN_DEFAULT_PASSWORD || 'SetuAdmin#2026';
    const adminCred: OfficialCredential = {
      email: adminEmail,
      role: 'admin',
      department: 'Sovereign BRICS Platform Administration',
      passwordHash: this.hashPassword(adminPass),
      plainPasswordSnippet: adminPass,
      createdAt: new Date().toISOString(),
      createdBy: 'system',
      isActive: true,
    };
    this.localCredentials.set(adminEmail, adminCred);

    // 2. Designated Municipal Official Account (debasis6269@gmail.com)
    const officialEmail = (process.env.OFFICIAL_EMAILS || 'debasis6269@gmail.com').toLowerCase().split(',')[0].trim();
    const officialPass = process.env.OFFICIAL_DEFAULT_PASSWORD || 'SetuOfficial#2026';
    const officialCred: OfficialCredential = {
      email: officialEmail,
      role: 'policymaker',
      department: 'Municipal Infrastructure & Urban Planning Bureau',
      passwordHash: this.hashPassword(officialPass),
      plainPasswordSnippet: officialPass,
      createdAt: new Date().toISOString(),
      createdBy: adminEmail,
      isActive: true,
    };
    this.localCredentials.set(officialEmail, officialCred);

    // 3. Sync to MongoDB Atlas if available
    try {
      const db = MongoDbConnector.getDb();
      if (db) {
        const collection = db.collection<OfficialCredential>('official_credentials');
        await collection.createIndex({ email: 1 }, { unique: true });

        // Upsert default credentials
        for (const cred of [adminCred, officialCred]) {
          await collection.updateOne(
            { email: cred.email },
            { $setOnInsert: cred },
            { upsert: true }
          );
        }

        // Hydrate local cache with existing credentials from MongoDB Atlas
        const existing = await collection.find({ isActive: true }).toArray();
        for (const c of existing) {
          this.localCredentials.set(c.email, c);
        }
      }
    } catch (err: any) {
      console.warn('[OfficialAuthService] MongoDB sync skipped, running on memory-backed credentials:', err.message);
    }

    this.initialized = true;
  }

  /**
   * Authenticates an official user with email and password
   */
  public static async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; token?: string; role?: string; user?: any }> {
    await this.initialize();
    const normalizedEmail = email.trim().toLowerCase();
    let cred = this.localCredentials.get(normalizedEmail);

    // If not in local cache, check MongoDB Atlas
    if (!cred) {
      try {
        const db = MongoDbConnector.getDb();
        if (db) {
          const doc = await db.collection<OfficialCredential>('official_credentials').findOne({ email: normalizedEmail });
          if (doc) {
            cred = doc;
            this.localCredentials.set(normalizedEmail, doc);
          }
        }
      } catch (err) {
        // fallback
      }
    }

    if (!cred || !cred.isActive) {
      return {
        success: false,
        message: 'Invalid official credentials or unauthorized clearance level.',
      };
    }

    const providedHash = this.hashPassword(password);
    if (providedHash !== cred.passwordHash) {
      return {
        success: false,
        message: 'Invalid email or password. Please verify credentials with system admin.',
      };
    }

    // Update last login
    cred.lastLogin = new Date().toISOString();
    try {
      const db = MongoDbConnector.getDb();
      if (db) {
        await db.collection('official_credentials').updateOne(
          { email: normalizedEmail },
          { $set: { lastLogin: cred.lastLogin } }
        );
      }
    } catch {
      // non-blocking
    }

    // Generate authenticated session token
    const tokenPayload = `${normalizedEmail}:${cred.role}:${Date.now()}`;
    const token = crypto
      .createHmac('sha256', process.env.JWT_SECRET || 'setu_secret')
      .update(tokenPayload)
      .digest('hex');

    return {
      success: true,
      message: 'Official authority credentials verified successfully.',
      token,
      role: cred.role,
      user: {
        email: cred.email,
        role: cred.role,
        department: cred.department,
        lastLogin: cred.lastLogin,
      },
    };
  }

  /**
   * Generates a new official account by the admin
   */
  public static async createOfficial(
    adminEmail: string,
    data: {
      email: string;
      role: 'policymaker' | 'governance_officer' | 'admin';
      department: string;
      password?: string;
    }
  ): Promise<{ success: boolean; message: string; credential?: any }> {
    await this.initialize();
    const normalizedAdmin = adminEmail.trim().toLowerCase();

    // Verify requesting user is admin
    const adminCred = this.localCredentials.get(normalizedAdmin);
    if (!adminCred || adminCred.role !== 'admin') {
      return {
        success: false,
        message: 'Access Denied: Only Super Administrators can generate official authority credentials.',
      };
    }

    const normalizedTarget = data.email.trim().toLowerCase();
    if (!normalizedTarget.includes('@')) {
      return { success: false, message: 'Valid email address is required.' };
    }

    // Generate password if not specified
    const generatedPassword = data.password || `Setu-${crypto.randomBytes(3).toString('hex').toUpperCase()}-2026`;
    const passwordHash = this.hashPassword(generatedPassword);

    const newCred: OfficialCredential = {
      email: normalizedTarget,
      role: data.role,
      department: data.department || 'Municipal Infrastructure Division',
      passwordHash,
      plainPasswordSnippet: generatedPassword,
      createdAt: new Date().toISOString(),
      createdBy: normalizedAdmin,
      isActive: true,
    };

    this.localCredentials.set(normalizedTarget, newCred);

    // Save to MongoDB Atlas
    try {
      const db = MongoDbConnector.getDb();
      if (db) {
        await db.collection('official_credentials').updateOne(
          { email: normalizedTarget },
          { $set: newCred },
          { upsert: true }
        );
      }
    } catch (err: any) {
      console.warn('[OfficialAuthService] Saved to local memory; MongoDB sync failed:', err.message);
    }

    return {
      success: true,
      message: `Official credentials generated for ${normalizedTarget}.`,
      credential: {
        email: newCred.email,
        role: newCred.role,
        department: newCred.department,
        generatedPassword,
        createdAt: newCred.createdAt,
      },
    };
  }

  /**
   * Lists all official accounts for admin view
   */
  public static async listOfficials(adminEmail: string): Promise<any[]> {
    await this.initialize();
    const normalizedAdmin = adminEmail.trim().toLowerCase();
    const adminCred = this.localCredentials.get(normalizedAdmin);
    if (!adminCred || adminCred.role !== 'admin') {
      return [];
    }

    // Pull from MongoDB or local map
    try {
      const db = MongoDbConnector.getDb();
      if (db) {
        const docs = await db.collection<OfficialCredential>('official_credentials').find().toArray();
        if (docs.length > 0) {
          return docs.map((c) => ({
            email: c.email,
            role: c.role,
            department: c.department,
            createdAt: c.createdAt,
            lastLogin: c.lastLogin || 'Never',
            isActive: c.isActive,
            passwordSnippet: c.plainPasswordSnippet || '••••••••',
          }));
        }
      }
    } catch {
      // fallback
    }

    return Array.from(this.localCredentials.values()).map((c) => ({
      email: c.email,
      role: c.role,
      department: c.department,
      createdAt: c.createdAt,
      lastLogin: c.lastLogin || 'Never',
      isActive: c.isActive,
      passwordSnippet: c.plainPasswordSnippet || '••••••••',
    }));
  }

  /**
   * Revokes or deactivates an official account
   */
  public static async revokeOfficial(adminEmail: string, targetEmail: string): Promise<boolean> {
    await this.initialize();
    const normalizedAdmin = adminEmail.trim().toLowerCase();
    const adminCred = this.localCredentials.get(normalizedAdmin);
    if (!adminCred || adminCred.role !== 'admin') {
      return false;
    }

    const normalizedTarget = targetEmail.trim().toLowerCase();
    if (normalizedTarget === normalizedAdmin) {
      return false; // Cannot revoke self
    }

    const cred = this.localCredentials.get(normalizedTarget);
    if (cred) {
      cred.isActive = false;
    }

    try {
      const db = MongoDbConnector.getDb();
      if (db) {
        await db.collection('official_credentials').updateOne(
          { email: normalizedTarget },
          { $set: { isActive: false } }
        );
      }
    } catch {
      // ignore
    }

    return true;
  }
}
