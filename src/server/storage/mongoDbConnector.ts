import { MongoClient, Db } from 'mongodb';
import dns from 'dns';

export interface MongoStatus {
  configured: boolean;
  connected: boolean;
  dbName: string;
  error?: string;
}

export class MongoDbConnector {
  private static client: MongoClient | null = null;
  private static db: Db | null = null;
  private static isConnecting = false;

  /**
   * Evaluates if MONGODB_URI is provided and is not a placeholder template
   */
  public static isConfigured(): boolean {
    const uri = process.env.MONGODB_URI;
    if (!uri) return false;
    if (uri.includes('<username>') || uri.includes('<password>') || uri.includes('xxxxx')) {
      return false;
    }
    return uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://');
  }

  /**
   * Connects to MongoDB if valid configuration is present
   */
  public static async connect(): Promise<Db | null> {
    if (this.db) return this.db;
    if (!this.isConfigured()) {
      return null;
    }
    if (this.isConnecting) return null;

    this.isConnecting = true;
    try {
      const uri = process.env.MONGODB_URI!;
      const dbName = process.env.MONGODB_DB_NAME || 'setu';

      // Set reliable public DNS on Windows to resolve mongodb+srv:// SRV records
      if (uri.startsWith('mongodb+srv://')) {
        try {
          dns.setServers(['8.8.8.8', '1.1.1.1']);
        } catch {
          // ignore if environment restricts dns.setServers
        }
      }
      
      this.client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 10000,
      });

      await this.client.connect();
      this.db = this.client.db(dbName);
      console.log(`[MongoDbConnector] Successfully connected to MongoDB Atlas database: "${dbName}"`);
      return this.db;
    } catch (err: any) {
      console.warn(`[MongoDbConnector] Connection attempt failed: ${err.message}. Using SovereignStore.`);
      this.client = null;
      this.db = null;
      return null;
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Returns current active Db instance or null
   */
  public static getDb(): Db | null {
    return this.db;
  }

  /**
   * Returns current status without exposing any credentials
   */
  public static getStatus(): MongoStatus {
    const configured = this.isConfigured();
    const dbName = process.env.MONGODB_DB_NAME || 'setu';

    return {
      configured,
      connected: this.db !== null,
      dbName,
      error: !configured ? 'Contains default placeholder (<username>:<password>) or not set' : undefined,
    };
  }

  /**
   * Disconnects gracefully
   */
  public static async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }
}
