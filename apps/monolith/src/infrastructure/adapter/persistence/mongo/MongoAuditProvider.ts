import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient, Collection, Db } from 'mongodb';

export const MONGO_AUDIT_COLLECTION = Symbol('MONGO_AUDIT_COLLECTION');

export const MongoAuditProvider: Provider = {
  provide: MONGO_AUDIT_COLLECTION,
  inject: [ConfigService],
  useFactory: async (config: ConfigService): Promise<Collection> => {
    const uri = config.get<string>('MONGO_URI') || 'mongodb://localhost:27017';
    const dbName = config.get<string>('MONGO_DB') || 'audit';
    const client = new MongoClient(uri);
    await client.connect();
    const db: Db = client.db(dbName);
    const collection = db.collection('audit_log');
    await collection.createIndex({ createdAt: -1 });
    await collection.createIndex({ path: 1, method: 1, createdAt: -1 });
    return collection;
  },
};
