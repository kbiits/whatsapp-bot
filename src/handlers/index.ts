import { MessageType, WAChatUpdate, WAConnection } from '@adiwajshing/baileys';
import { ResolverResult } from '../types/type';
import checkPrefix from '../utils/checkPrefix';
import { getResolver } from '../utils/resolver';

export const handler = (conn: WAConnection, chat: WAChatUpdate) => {
  if (!chat.hasNewMessage) return;
  if (!chat.messages) return;
  // mark chat as read
  conn.chatRead(chat.jid, 'read');

  chat.messages?.all()?.forEach(async (message) => {
    if (message.key?.fromMe ?? true) return;
    let text = '';

    const messageType = Object.keys(message.message)[0];
    if (messageType === MessageType.text) {
      text = message.message?.conversation?.trim() ?? '';
    } else if (messageType === MessageType.extendedText) {
      text = message.message.extendedTextMessage.text;
    } else if (messageType === MessageType.image) {
      text = message.message.imageMessage.caption;
    }

    if (!checkPrefix(text)) {
      if (chat.jid.match(/@g\.us$/) && text.indexOf('@everyone') !== -1) {
        const participantsJids = chat.metadata?.participants.map((p) => p.jid) ?? [];

        await conn.sendMessage(chat.jid, '.', MessageType.extendedText, {
          quoted: message,
          contextInfo: {
            mentionedJid: participantsJids,
          },
        });
        return;
      }
      return;
    }

    const chatTextArr = text.split(/ +/);

    // if there's no command specified
    if (chatTextArr.length === 1) {
      conn.sendMessage(
        chat.jid,
        `Halo, ${chat.jid.endsWith('@g.us') ? `@${message.participant.split('@')[0]}` : 'ada apa ?'}`,
        MessageType.extendedText,
        {
          contextInfo: {
            mentionedJid: [message.participant],
          },
        }
      );
      return;
    }

    chatTextArr.shift();
    const resolver = getResolver(chatTextArr);

    const sendMessage: ResolverResult = await resolver(message, chat.jid);

    if (!sendMessage || !sendMessage.destinationId || !sendMessage.message || !sendMessage.type) return;
    conn.sendMessage(sendMessage.destinationId, sendMessage.message, sendMessage.type, sendMessage.options);
  });
};
