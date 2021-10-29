import { WAConnection } from '@adiwajshing/baileys';
import { handler } from './handlers';
import { writeFileSync, statSync, existsSync } from 'fs';

const conn = new WAConnection();
conn.on('open', () => {
  const authInfo = conn.base64EncodedAuthInfo(); // get all the auth info we need to restore this session
  writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t')); // save this info to a file
});

if (existsSync('./auth_info.json') && statSync('./auth_info.json').size >= 5)
  // check the bytes
  conn.loadAuthInfo('./auth_info.json');

conn.on('chat-update', (chat) => handler(conn, chat));
export default conn;
