import { MessageType, proto } from '@adiwajshing/baileys';
import { ResolverFunction, ResolverResult } from '../types/type';

export const wrongCommands: ResolverFunction = (
  message: proto.WebMessageInfo,
): ResolverResult => {
  const msg = `Maaf, command salah`;
  return {
    destinationId: message.key.remoteJid,
    type: MessageType.text,
    message: msg,
    options: {
      contextInfo: {
        quotedMessage: message.message,
      },
      quoted: message,
    },
  };
};
