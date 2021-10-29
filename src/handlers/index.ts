import { MessageType, WAChatUpdate, WAConnection } from '@adiwajshing/baileys';
import { ResolverResult } from '../types/type';
import checkCommand from '../utils/checkCommand';
import { rootMessage } from '../utils/replyMessage';
import { getResolver } from '../utils/resolver';

export const handler = (conn: WAConnection, chat: WAChatUpdate) => {
  if (!chat.messages) return;

  chat.messages?.all()?.forEach((c) => {
    // mark chat as read
    conn.chatRead(c.key.remoteJid, 'read');

    if (c.key?.fromMe ?? true) return;

    if (!checkCommand(c.message?.conversation)) return;

    const chatTextArr = c.message.conversation.split(' ');

    // if there's no command specified
    if (chatTextArr.length === 1) {
      conn.sendMessage(
        c.key.remoteJid,
        rootMessage(c.participant),
        MessageType.extendedText,
        {
          contextInfo: {
            mentionedJid: [c.participant],
          },
        },
      );
      return;
    }

    const intents = chatTextArr.slice(1);
    const resolver = getResolver(intents);

    const sendMessage: ResolverResult = resolver(c);
    conn.sendMessage(
      sendMessage.destinationId,
      sendMessage.message,
      sendMessage.type,
      sendMessage.options,
    );
  });
};
