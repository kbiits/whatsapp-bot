import { MessageType, Mimetype, proto } from '@adiwajshing/baileys';
import sharp from 'sharp';
import conn from '../socketConnection';
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from '../types/type';

const allowedMimetype = [Mimetype.gif, Mimetype.jpeg, Mimetype.png];

export const convertToSticker: ResolverFunctionCarry =
  (): ResolverFunction =>
  async (message: proto.WebMessageInfo, jid: string): Promise<ResolverResult> => {
    if (!message.message?.imageMessage) {
      return {
        destinationId: jid,
        message: 'Please include the media when sending the command',
        type: MessageType.text,
        options: {
          quoted: message,
        },
      };
    }
    const mimeType = message.message.imageMessage.mimetype;
    if (!allowedMimetype.includes(mimeType as Mimetype)) {
      return {
        destinationId: jid,
        message: 'Not allowed mimetype',
        type: MessageType.text,
        options: {
          quoted: message,
        },
      };
    }

    conn.sendMessage(jid, 'Wait a minute', MessageType.text);
    message.message.imageMessage.fileLength;
    const image = await conn.downloadMediaMessage(message);
    try {
      const bufferWebp = await sharp(image, {
        failOnError: true,
      })
        .resize(512, 512)
        .webp()
        .toBuffer();
      conn.sendMessage(jid, bufferWebp, MessageType.sticker, {
        mimetype: Mimetype.webp,
      });
    } catch (error) {
      console.log('error webp');
      console.log(error);

      conn.sendMessage(jid, `Sorry, something went wrong and I can't convert your image to sticker`, MessageType.text, {
        quoted: message,
      });
    }
  };
