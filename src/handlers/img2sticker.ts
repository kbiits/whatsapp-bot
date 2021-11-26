import { MessageType, Mimetype, proto } from '@adiwajshing/baileys';
import sharp from 'sharp';
import conn from '../socketConnection';
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from '../types/type';
import { downloadMediaIMessageBuffer } from '../utils/downloadMedia';

const allowedMimetype = [Mimetype.gif, Mimetype.jpeg, Mimetype.png];

export const convertToSticker: ResolverFunctionCarry =
  (): ResolverFunction =>
  async (message: proto.WebMessageInfo, jid: string): Promise<ResolverResult> => {
    let tempMessage: proto.IMessage = message.message;

    if (!tempMessage.imageMessage) {
      tempMessage = tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage ?? null;
      // const tempImage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage ?? null;
      if (!tempMessage || (!tempMessage.imageMessage ?? true))
        return {
          destinationId: jid,
          message: 'Please include the media when sending the command',
          type: MessageType.text,
          options: {
            quoted: message,
          },
        };
    }

    if (tempMessage.imageMessage.fileLength > 1000 * 1000 * 4) {
      return {
        destinationId: jid,
        message: `Cannot convert image with size greater than 4_000_000 bytes`,
        type: MessageType.text,
        options: {
          quoted: message,
        },
      };
    }

    let mimeType: Mimetype = tempMessage.imageMessage.mimetype as Mimetype;

    if (!mimeType) mimeType = message.message.imageMessage.mimetype as Mimetype;
    if (!allowedMimetype.includes(mimeType)) {
      return {
        destinationId: jid,
        message: 'Not allowed mimetype',
        type: MessageType.text,
        options: {
          quoted: message,
        },
      };
    }

    const ratio = tempMessage.imageMessage.width / tempMessage.imageMessage.height;

    const imageMessage: Buffer = (await downloadMediaIMessageBuffer(tempMessage)) as Buffer;

    conn.sendMessage(jid, 'Wait a minute', MessageType.text);
    try {
      const bufferWebp = await sharp(imageMessage, {
        failOnError: true,
      })
        .resize(512, 512, {
          fit: Math.abs(ratio - 1) > 0.1 ? 'contain' : 'cover',
          background: {
            r: 0,
            b: 0,
            g: 0,
            alpha: 0,
          },
        })
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
