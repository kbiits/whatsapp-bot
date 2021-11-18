import { commands } from '../constants/commands';
import { wrongCommands } from '../handlers/wrongCommands';
import { ResolverFunction } from '../types/type';

export const getResolver = (chatText: string): ResolverFunction => {
  let regexResult: RegExpMatchArray = null;

  for (const key of Object.keys(commands)) {
    const regex = new RegExp(key, 'i');
    regexResult = chatText.match(regex);
    if (regexResult) {
      return commands[key](regexResult);
    }
  }
  return wrongCommands;
};
