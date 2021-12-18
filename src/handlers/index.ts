import { isGroupID, MessageType, WAChatUpdate, WAConnection } from '@adiwajshing/baileys';
import { ResolverFunction, ResolverResult } from '../types/type';
import checkPrefix from '../utils/checkPrefix';
import { getResolver, getResolverWithoutPrefix } from '../utils/resolver';
import { escapeRegExp } from '../utils/stringUtils';


export const handler = (conn: WAConnection, chat: WAChatUpdate) => {
  const developerNumbers = process.env.DEVELOPER_WHATSAPP_NUMBER;
  if (!chat.hasNewMessage) return;
  if (!chat.messages) return;
  // mark chat as read
  conn.chatRead(chat.jid, 'read');

  chat.messages?.all()?.forEach(async (message) => {
    // if it is not a regular text or media message
    if (!message.message) return;
    if (message.key?.fromMe ?? true) return;
    let text = '';
    const isFromGroup = isGroupID(chat.jid);

    const messageType = Object.keys(message.message)[0];
    if (messageType === MessageType.text) {
      text = message.message?.conversation?.trim() ?? '';
    } else if (messageType === MessageType.extendedText) {
      text = message.message?.extendedTextMessage?.text?.trim() ?? '';
    } else if (messageType === MessageType.image) {
      text = message.message?.imageMessage?.caption?.trim() ?? '';
    }

    const prefix = text.length && await checkPrefix(text.match(/(\S+)/)[1], chat.jid);
    if (!prefix) {
      const resolver = getResolverWithoutPrefix(text.replace(/ +/g, ' '));
      return sendMessageFromResolver(resolver)
      // if (isFromGroup) {
      //   let matches = text.match(/@[A-Za-z]+[\w-]+/g);
      //   if (matches && matches.length) {
      //     const sendMessage = await sendRoleMention(matches, chat.jid, chat.jid);
      //     if (!sendMessage) return;
      //     sendMessage.options && (sendMessage.options.quoted = message);
      //     await conn.sendMessage(sendMessage.destinationId, sendMessage.message, sendMessage.type, sendMessage.options);
      //     return;
      //   }
      // }
      // const askForHelp = text.match(/help|tolong|bantu/);

      // if (askForHelp && (!isFromGroup || message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes(conn.user.jid))) {
      //   const sendMessage = await helpReply(askForHelp)(message, chat.jid);
      //   conn.sendMessage(sendMessage.destinationId, sendMessage.message, sendMessage.type, sendMessage.options);
      // }
      // return;
    }

    if (process.env.IS_DEVELOPMENT !== 'false' && !developerNumbers.includes(message.participant)) {
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

    // if there's no command specified
    if (text.match(`^${escapeRegExp((prefix as string))}$`)) {
      conn.sendMessage(
        chat.jid,
        `Halo, ${isFromGroup ? `@${message.participant.split('@')[0]}` : 'ada apa ?'}`,
        MessageType.extendedText,
        {
          contextInfo: {
            mentionedJid: [message.participant],
          },
        }
      );
      return;
    }


    const regexPre = new RegExp(`^ *${escapeRegExp(prefix as string)} *`);
    const resolver = getResolver(text.replace(regexPre, '').replace(/ +/g, ' '));
    return sendMessageFromResolver(resolver);

    async function sendMessageFromResolver(resolver: ResolverFunction) {
      if (!resolver) return;

      const sendMessage: ResolverResult = await resolver(message, chat.jid, isFromGroup);

      if (!sendMessage || !sendMessage.destinationId || !sendMessage.message || !sendMessage.type) return;
      conn.sendMessage(sendMessage.destinationId, sendMessage.message, sendMessage.type, sendMessage.options);
    };
  });
};


