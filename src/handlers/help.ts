import { MessageType, proto } from '@adiwajshing/baileys';
import {
  ResolverFunction,
  ResolverFunctionCarry,
  ResolverResult,
} from '../types/type';

export const helpReply: ResolverFunctionCarry =
  () =>
  (message: proto.WebMessageInfo): ResolverResult => {
    const msg = `List Commands :
  1. help (Menampilkan bantuan)
  2. reminders add :id (Menambah reminder)
  3. reminders remove :id (Menghapus reminder)
  `;

    return {
      destinationId: message.key.remoteJid,
      message: msg,
      type: MessageType.text,
      options: {
        quoted: message,
        contextInfo: {
          quotedMessage: message.message,
        },
      },
    };
  };
