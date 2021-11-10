import { isGroupID, MessageType, WAChatUpdate, WAConnection } from '@adiwajshing/baileys';
import { ResolverResult } from '../types/type';
import checkPrefix from '../utils/checkPrefix';
import { getOnlyGroupId } from '../utils/getOnlyGroupId';
import { getResolver } from '../utils/resolver';
import { sendRoleMention } from '../utils/sendRoleMention';

export const handler = (conn: WAConnection, chat: WAChatUpdate) => {
  if (!chat.hasNewMessage) return;
  if (!chat.messages) return;
  // mark chat as read
  conn.chatRead(chat.jid, 'read');

  chat.messages?.all()?.forEach(async (message) => {
    // if it is not a regular text or media message
    if (!message.message) return;
    if (message.key?.fromMe ?? true) return;
    let text = '';

    const messageType = Object.keys(message.message)[0];
    if (messageType === MessageType.text) {
      text = message.message?.conversation ?? '';
    } else if (messageType === MessageType.extendedText) {
      text = message.message.extendedTextMessage.text;
    } else if (messageType === MessageType.image) {
      text = message.message.imageMessage.caption;
    }

    if (!checkPrefix(text)) {
      if (isGroupID(chat.jid)) {
        if (text.indexOf('@everyone') !== -1) {
          const participantsJids = (await conn.groupMetadata(chat.jid)).participants.map((p) => p.jid) ?? [];
          await conn.sendMessage(chat.jid, '.', MessageType.extendedText, {
            quoted: message,
            contextInfo: {
              mentionedJid: participantsJids,
            },
          });
          return;
        }

        let matches = text.trim().match(/@[A-Za-z0-9]+/g);
        if (matches && matches.length) {
          const sendMessage = await sendRoleMention(matches, getOnlyGroupId(chat.jid), chat.jid);
          if (!sendMessage) return;
          sendMessage.options && (sendMessage.options.quoted = message);
          await conn.sendMessage(sendMessage.destinationId, sendMessage.message, sendMessage.type, sendMessage.options);
          return;
        }
      }
      return;
    }

    if (process.env.IS_DEVELOPMENT !== 'false') {
      await conn.sendMessage(
        chat.jid,
        "Sorry, currently my creator trying to improve me so I can't process your request now",
        MessageType.text,
        {
          quoted: message,
        }
      );
      return;
    }

    const chatTextArr = text.trim().split(/ +/);

    // if there's no command specified
    if (chatTextArr.length === 1) {
      conn.sendMessage(
        chat.jid,
        `Halo, ${isGroupID(chat.jid) ? `@${message.participant.split('@')[0]}` : 'ada apa ?'}`,
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
