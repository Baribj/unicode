import { MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const connectionString = process.env.MONGODB_CONNECTION_STRING!;

let dbClient: MongoClient;
let dbClientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  dbClient = new MongoClient(connectionString);
  global._mongoClientPromise = dbClient.connect();
}

dbClientPromise = global._mongoClientPromise;

export async function getDb() {
  const dbClient = await dbClientPromise;
  return dbClient.db("unicode");
}

export { dbClientPromise };
