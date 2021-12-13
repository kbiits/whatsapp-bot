// import { MessageType, Mimetype, proto } from '@adiwajshing/baileys';
// import conn from '../socketConnection';
// import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from '../types/type';
// import { downloadMediaIMessageBuffer } from '../utils/downloadMedia';
// import ffmpeg from 'fluent-ffmpeg';
// import internal, { Stream } from 'stream';
// import { createWriteStream } from 'fs';

// const allowedMimetype = [Mimetype.gif, Mimetype.mp4];
// const ffmpegOutputOptions = [
//   `-vcodec`,
//   `libwebp`,
//   `-vf`,
//   `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
// ];

// export const gif2Sticker: ResolverFunctionCarry =
//   (): ResolverFunction =>
//   async (message: proto.WebMessageInfo, jid: string): Promise<ResolverResult> => {
//     let tempMessage: proto.IMessage = message.message;

//     if (!tempMessage.videoMessage) {
//       tempMessage = tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage ?? null;
//       // const tempImage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage ?? null;
//       if (!tempMessage || (!tempMessage.videoMessage ?? true))
//         return {
//           destinationId: jid,
//           message: 'Please include the media when sending the command',
//           type: MessageType.text,
//           options: {
//             quoted: message,
//           },
//         };
//     }

//     if (tempMessage.videoMessage.fileLength > 1000 * 1000 * 4) {
//       // 4MB
//       return {
//         destinationId: jid,
//         message: `Cannot convert image with size greater than 4MB`,
//         type: MessageType.text,
//         options: {
//           quoted: message,
//         },
//       };
//     }

//     let mimeType: Mimetype = tempMessage.videoMessage.mimetype as Mimetype;

//     if (!mimeType) mimeType = message.message.videoMessage.mimetype as Mimetype;
//     if (!allowedMimetype.includes(mimeType)) {
//       return {
//         destinationId: jid,
//         message: 'Not allowed mimetype',
//         type: MessageType.text,
//         options: {
//           quoted: message,
//         },
//       };
//     }

//     const videoMessage: internal.Readable = (await downloadMediaIMessageBuffer(
//       tempMessage,
//       'stream'
//     )) as internal.Readable;

//     conn.sendMessage(jid, 'Wait a minute', MessageType.text);
//     try {
//       const stream = new Stream.Transform();
//       ffmpeg()
//         .input(videoMessage)
//         .inputFormat('mp4')
//         .noAudio()
//         .outputOptions(ffmpegOutputOptions)
//         .outputFormat('webp')
//         .output(stream)
//         .run();
//       conn.sendMessage(jid, { stream }, MessageType.sticker, {
//         mimetype: Mimetype.webp,
//         isAnimated: true,
//       });
//     } catch (error) {
//       console.log('error webp');
//       console.log(error);

//       conn.sendMessage(jid, `Sorry, something went wrong and I can't convert your image to sticker`, MessageType.text, {
//         quoted: message,
//       });
//     }
//   };
