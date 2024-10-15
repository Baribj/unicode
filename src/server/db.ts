import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const connectionString = process.env.MONGODB_CONNECTION_STRING!;

let dbClient: MongoClient;
let dbClientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  dbClient = new MongoClient(connectionString);
  global._mongoClientPromise = dbClient.connect();
}

// eslint-disable-next-line prefer-const
dbClientPromise = global._mongoClientPromise;

export async function getDb() {
  const dbClient = await dbClientPromise;
  return dbClient.db("unicode");
}

export { dbClientPromise };
