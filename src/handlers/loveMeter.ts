import { MessageType, proto } from '@adiwajshing/baileys';
import axios from 'axios';
import { ResolverFunction, ResolverResult } from '../types/type';

export const loveMeter =
  (matches: RegExpMatchArray): ResolverFunction =>
  async (message: proto.WebMessageInfo, jid: string): Promise<ResolverResult> => {
    const host = process.env.LOVE_CALCULATOR_RAPID_API_HOST;
    const apiKey = process.env.LOVE_CALCULATOR_RAPID_API_KEY;

    const { data } = await axios.get('https://love-calculator.p.rapidapi.com/getPercentage', {
      params: {
        fname: matches[1],
        sname: matches[2],
      },
      headers: {
        'x-rapidapi-host': host,
        'x-rapidapi-key': apiKey,
      },
    });

    return {
      destinationId: jid,
      message: `Match ${data.percentage}%\n\nMy advice : ${data.result}`,
      type: MessageType.text,
      options: {
        quoted: message,
      },
    };
  };
