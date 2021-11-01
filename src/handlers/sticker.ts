import { MessageType, Mimetype, proto } from '@adiwajshing/baileys';
import sharp from 'sharp';
import conn from '../socketConnection';
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from '../types/type';
import { downloadMediaIMessageBuffer } from '../utils/downloadMedia';

const allowedMimetype = [Mimetype.gif, Mimetype.jpeg, Mimetype.png];

export const convertToSticker: ResolverFunctionCarry =
  (): ResolverFunction =>
  async (message: proto.WebMessageInfo, jid: string): Promise<ResolverResult> => {
    let imageMessage: Buffer;
    let mimeType: Mimetype;
    if (!message.message?.imageMessage) {
      const tempImage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage ?? null;
      if (!tempImage ?? true)
        return {
          destinationId: jid,
          message: 'Please include the media when sending the command',
          type: MessageType.text,
          options: {
            quoted: message,
          },
        };
      else {
        imageMessage = (await downloadMediaIMessageBuffer(
          message.message.extendedTextMessage.contextInfo.quotedMessage,
          'buffer'
        )) as Buffer;
        mimeType = tempImage.mimetype as Mimetype;
      }
    }

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

    conn.sendMessage(jid, 'Wait a minute', MessageType.text);
    if (!imageMessage) imageMessage = await conn.downloadMediaMessage(message);
    try {
      const bufferWebp = await sharp(imageMessage, {
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
