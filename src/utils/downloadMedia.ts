import { decryptMediaMessageBuffer, proto } from '@adiwajshing/baileys';

export const downloadMediaIMessageBuffer = async (mContent: proto.IMessage, type: 'buffer' | 'stream' = 'buffer') => {
  const dowloadMediaMessage = async () => {
    const stream = await decryptMediaMessageBuffer(mContent);
    if (type === 'buffer') {
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }
      return buffer;
    }
    return stream;
  };

  const buff = await dowloadMediaMessage();
  return buff;
};
