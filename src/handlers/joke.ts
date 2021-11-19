import { MessageType, proto } from '@adiwajshing/baileys';
import InvalidOptionError from '../exceptions/InvalidOptionError';
import { getRandomJokeProvider } from '../providers/Jokes/Joke';
import { JokeModel } from '../providers/Jokes/JokeModel';
import conn from '../socketConnection';
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from '../types/type';

export const joke: ResolverFunctionCarry =
  (matches: RegExpMatchArray): ResolverFunction =>
  async (message: proto.WebMessageInfo, jid: string): Promise<ResolverResult> => {
    let isDark = false;
    if (matches.length && matches[1]) {
      isDark = true;
    }

    const JokeProvider = getRandomJokeProvider();
    let joke: JokeModel;
    try {
      const jokeGenerator = matches[2] ? JokeProvider.getRandomJoke(matches[2].trim()) : JokeProvider.getRandomJoke();
      for await (const j of jokeGenerator) {
        if (j.loading) {
          await conn.sendMessage(jid, 'Wait a minute', MessageType.text);
        } else {
          joke = j as JokeModel;
          break;
        }
      }
    } catch (error) {
      if (error instanceof InvalidOptionError) {
        return {
          destinationId: jid,
          message: error.message,
          type: MessageType.extendedText,
          options: {
            quoted: message,
          },
        };
      }
      console.log(error);
      return {
        destinationId: jid,
        message: 'Failed to fetch joke, please try again',
        type: MessageType.text,
        options: {
          quoted: message,
        },
      };
    }
    if (joke.mediaType === 'text' || !joke.media) {
      return {
        destinationId: jid,
        message: joke.text,
        type: MessageType.text,
      };
    }

    return {
      destinationId: jid,
      message: joke.media,
      type: joke.mediaType === 'video' ? MessageType.video : MessageType.image,
      options: {
        caption: joke.text,
        mimetype: joke.mimeType,
      },
    };
  };
