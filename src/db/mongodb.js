import { MongoClient } from "mongodb";

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env"
    );
  }

  const client = new MongoClient(MONGODB_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
  });

  await client.connect();
  const db = client.db(process.env.DB_NAME || "erp_database");

  cachedClient = client;
  cachedDb = db;

  console.log("✅ Connected to MongoDB");

  return { client, db };
}

export async function getMongoDb() {
  const { db } = await connectToDatabase();
  return db;
}

export async function getMongoClient() {
  const { client } = await connectToDatabase();
  return client;
}