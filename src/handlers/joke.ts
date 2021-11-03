import { MessageType, proto } from '@adiwajshing/baileys';
import axios from 'axios';
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from '../types/type';

export const joke: ResolverFunctionCarry =
  (matches: RegExpMatchArray): ResolverFunction =>
  async (message: proto.WebMessageInfo, jid: string): Promise<ResolverResult> => {
    let isDark = false;
    if (matches.length && matches[1]) {
      isDark = true;
    }
    const { data } = await axios.get(
      `https://v2.jokeapi.dev/joke/${
        isDark ? 'Dark' : 'Any'
      }?blacklistFlags=nsfw&format=txt`
    );

    if (!data) {
      return {
        destinationId: jid,
        message: `Sorry, but I don't have any jokes for you now`,
        type: MessageType.text,
      };
    }

    return {
      destinationId: jid,
      message: data,
      type: MessageType.text,
      options: {
        quoted: message,
      },
    };
  };
