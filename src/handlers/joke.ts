import { MessageType, proto } from '@adiwajshing/baileys';
import { getRandomJokeProvider } from '../providers/Jokes/Joke';
import { JokeModel } from '../providers/Jokes/JokeModel';
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
      joke = await JokeProvider.getRandomJoke();
    } catch (error) {
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
      },
    };
  };
