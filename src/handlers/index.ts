import { MessageType, WAChatUpdate, WAConnection, WA_MESSAGE_STUB_TYPE } from '@adiwajshing/baileys';
import { ResolverResult } from '../types/type';
import checkCommand from '../utils/checkCommand';
import { rootMessage } from '../utils/replyMessage';
import { getResolver } from '../utils/resolver';

export const handler = (conn: WAConnection, chat: WAChatUpdate) => {
  if (!chat.hasNewMessage) return;
  if (!chat.messages) return;
  // mark chat as read
  conn.chatRead(chat.jid, 'read');

  chat.messages?.all()?.forEach(async (message) => {
    if (message.key?.fromMe ?? true) return;

    if (!checkCommand(message.message?.conversation.trim() ?? '')) {
      if (chat.jid.match(/@g\.us$/) && message.message?.conversation?.indexOf('@everyone') !== -1) {
        const participants = (await conn.groupMetadata(chat.jid)).participants;
        const participantsJids = participants.map((p) => p.jid);

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

    const chatTextArr = message.message.conversation.trim().split(' ');

    // if there's no command specified
    if (chatTextArr.length === 1) {
      conn.sendMessage(chat.jid, rootMessage(message.participant), MessageType.extendedText, {
        contextInfo: {
          mentionedJid: [message.participant],
        },
      });
      return;
    }

    const intents = chatTextArr.slice(1);
    const resolver = getResolver(intents);

    const sendMessage: ResolverResult = await resolver(message, chat.jid);

    conn.sendMessage(sendMessage.destinationId, sendMessage.message, sendMessage.type, sendMessage.options);
  });
};
