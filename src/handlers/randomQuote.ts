import { MessageType, proto } from '@adiwajshing/baileys';
import axios from 'axios';
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from '../types/type';

export const randomQuote: ResolverFunctionCarry =
  (): ResolverFunction =>
  async (message: proto.WebMessageInfo, jid: string): Promise<ResolverResult> => {
    const { data } = await axios.get('https://api.quotable.io/random');

    if (!data) {
      return {
        destinationId: jid,
        message: `Sorry, I don't have any quotes for you now`,
        type: MessageType.text,
        options: {
          quoted: message,
        },
      };
    }

    const msg = `${data.content}\n\n-- ${data.author} --`;

    return {
      destinationId: jid,
      message: msg,
      type: MessageType.text,
      options: {
        quoted: message,
      },
    };
  };
