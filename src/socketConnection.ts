import { WAConnection } from '@adiwajshing/baileys';
import { existsSync, writeFileSync } from 'fs';
import { handler } from './handlers';

const conn = new WAConnection();
conn.version = [2, 2140, 12];
conn.connectOptions.maxRetries = 5;
conn.on('open', () => {
  const authInfo = conn.base64EncodedAuthInfo(); // get all the auth info we need to restore this session
  writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t')); // save this info to a file
});

existsSync('./auth_info.json') && conn.loadAuthInfo('./auth_info.json');

conn.on('chat-update', (chat) => handler(conn, chat));
export default conn;
