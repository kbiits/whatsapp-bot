import { MessageType, proto } from '@adiwajshing/baileys';
import axios from 'axios';
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from '../types/type';

export const badQuotes: ResolverFunctionCarry =
  (): ResolverFunction =>
  async (message: proto.WebMessageInfo, jid: string): Promise<ResolverResult> => {
    const { data } = await axios.get('https://breaking-bad-quotes.herokuapp.com/v1/quotes'); // get random bad quotes
    if (!Array.isArray(data) || !data.length) {
      return {
        destinationId: jid,
        message: `Sorry, I don't have any quotes for you now`,
        type: MessageType.text,
        options: {
          quoted: message,
        },
      };
    }
    const quote = data[0];
    const sendMessage = `${quote.quote}\n\n-- ${quote.author} --`;

    return {
      destinationId: jid,
      message: sendMessage,
      type: MessageType.text,
      options: {
        quoted: message,
      },
    };
  };