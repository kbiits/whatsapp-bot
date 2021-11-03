// import { MessageType, proto } from '@adiwajshing/baileys';
// import { Readable } from 'node:stream';
// import conn from '../socketConnection';
// import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from '../types/type';
// import { downloadMediaIMessageBuffer } from '../utils/downloadMedia';
// import ffmpeg from 'fluent-ffmpeg';

// export const gifToSticker: ResolverFunctionCarry =
//   (): ResolverFunction =>
//   async (message: proto.WebMessageInfo, jid: string): Promise<ResolverResult> => {
//     let gif: proto.IMessage = message.message;
//     if (!gif.videoMessage) {
//       const tempgif: proto.IMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage ?? null;
//       if (!tempgif.videoMessage) {
//         return {
//           destinationId: jid,
//           message: 'Please include the media when sending the command',
//           type: MessageType.text,
//           options: {
//             quoted: message,
//           },
//         };
//       } else {
//         gif = tempgif;
//       }
//     }
//     const stream: Readable = (await downloadMediaIMessageBuffer(gif, 'stream')) as Readable;
//     conn.sendMessage(jid, 'Wait a minute', MessageType.text);

//     try {
//       ffmpeg()
//         .input(stream)
//         .inputFormat('');
//     } catch (error) {
//       console.log('error webp');
//       console.log(error);

//       conn.sendMessage(jid, `Sorry, something went wrong and I can't convert it to sticker`, MessageType.text, {
//         quoted: message,
//       });
//     }
//   };
