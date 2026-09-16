import mongoose from 'mongoose';

export let isConnectedToMongo = false;

// Custom in-memory store fallback for development
export class InMemoryStore {
  private static collections: Record<string, any[]> = {};

  static getCollection(name: string) {
    if (!this.collections[name]) {
      this.collections[name] = [];
    }
    return this.collections[name];
  }

  static find(collection: string, query: Record<string, any> = {}) {
    const list = this.getCollection(collection);
    return list.filter(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  }

  static findOne(collection: string, query: Record<string, any>) {
    const items = this.find(collection, query);
    return items.length > 0 ? items[0] : null;
  }

  static insertOne(collection: string, doc: any) {
    const list = this.getCollection(collection);
    const newDoc = { 
      _id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...doc 
    };
    list.push(newDoc);
    return newDoc;
  }

  static findOneAndUpdate(collection: string, query: Record<string, any>, update: any, options = { upsert: false }) {
    let item = this.findOne(collection, query);
    if (!item) {
      if (options.upsert) {
        return this.insertOne(collection, { ...query, ...update });
      }
      return null;
    }
    Object.assign(item, update, { updatedAt: new Date() });
    return item;
  }

  static deleteOne(collection: string, query: Record<string, any>) {
    const list = this.getCollection(collection);
    const index = list.findIndex(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    if (index > -1) {
      list.splice(index, 1);
      return true;
    }
    return false;
  }
}

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn('⚠️ MONGO_URI not found in env. Falling back to high-fidelity In-Memory Store.');
    isConnectedToMongo = false;
    return;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnectedToMongo = true;
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error: any) {
    console.error(`⚠️ MongoDB connection error: ${error.message}. Falling back to In-Memory Store.`);
    isConnectedToMongo = false;
  }
}
