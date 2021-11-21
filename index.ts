import mongoose from 'mongoose';
import conn from './src/socketConnection';
require('dotenv').config();

const DB_URI = process.env.MONGODB_URI || null;
if (!DB_URI) {
  throw Error('DB URI Not Found!');
}

(async () => {
  mongoose
    .connect(DB_URI)
    .then(() => console.log('mongoDB connected'))
    .catch((err) => {
      console.log('Failed to connect to db');
      console.log(err);
      throw err;
    });

  await conn.connect();
})().catch((err) => console.log('encountered error : ', err));
