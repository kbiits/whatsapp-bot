import { MessageType, proto } from '@adiwajshing/baileys';
import axios from 'axios';
import { getRandomQuoteProvider } from '../providers/Quote';
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from '../types/type';

export const randomQuote: ResolverFunctionCarry =
  (): ResolverFunction =>
  async (message: proto.WebMessageInfo, jid: string): Promise<ResolverResult> => {
    const QuoteProvider = getRandomQuoteProvider();

    const msg = await QuoteProvider.getRandomQuote();

    return {
      destinationId: jid,
      message: msg as string,
      type: MessageType.text,
      options: {
        quoted: message,
      },
    };
  };
