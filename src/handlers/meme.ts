import { MessageType, proto, WAMediaUpload } from '@adiwajshing/baileys';
import InvalidOptionError from '../exceptions/InvalidOptionError';
import { MemeNotFound } from '../exceptions/MemeNotFound';
import { getRandomMemeProvider } from '../providers/Memes/Meme';
import MemeModel from '../providers/Memes/MemeModel';
import conn from '../socketConnection';
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from '../types/type';

export const meme: ResolverFunctionCarry =
  (matches: RegExpMatchArray): ResolverFunction =>
  async (message: proto.WebMessageInfo, jid: string): Promise<ResolverResult> => {
    try {
      const MemeProvider = getRandomMemeProvider();
      const memeGenerator = matches[1] ? MemeProvider.getRandomMeme(matches[1].trim()) : MemeProvider.getRandomMeme();
      for await (const m of memeGenerator) {
        if (m.loading) {
          await conn.sendMessage(jid, 'Wait a minute', MessageType.text);
        } else {
          const meme: MemeModel = m as MemeModel;
          if (!meme.content) {
            console.log(meme);
            throw new Error('meme content null');
          }

          return {
            destinationId: jid,
            message: meme.content,
            type: meme.mediaType === 'image' ? MessageType.image : MessageType.video,
            options: {
              caption: meme.caption,
              mimetype: meme.mimeType,
            },
          };
        }
      }
    } catch (error) {
      let obj: any = {
        destinationId: jid,
        type: MessageType.extendedText,
        options: {
          quoted: message,
        },
      };
      if (error instanceof InvalidOptionError || error instanceof MemeNotFound) {
        obj.message = error.message;
      } else {
        console.log(error);
        obj.message = 'Failed to fetch meme, please try again';
      }
      return obj as ResolverResult;
    }
  };
