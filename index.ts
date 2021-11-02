import conn from './src/socketConnection';
(async () => {
  await conn.connect();
})().catch((err) => console.log('encountered error : ', err));
