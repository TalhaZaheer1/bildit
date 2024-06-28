import mongoose, { connect } from "mongoose";

type GlobalMongoose = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// declare global {
//   namespace NodeJs {
//     interface Global {
//       mongoose: GlobalMongoose;
//     }
//   }
// }
// @ts-ignore
let cached = global.mongoose as GlobalMongoose;
// @ts-ignore
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export default async function dbConnect() {
  if (cached.conn) {
    return;
  }
  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxIdleTimeMS: 10000 , // 30 seconds
      socketTimeoutMS: 10000 , // 45 seconds
      serverSelectionTimeoutMS:10000
    };

    cached.promise = connect(process.env.DATABASE_URL!, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
  console.log("DATABASE CONNECTED");
}
