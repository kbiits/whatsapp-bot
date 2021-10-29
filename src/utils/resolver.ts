import { commands } from '../constants/commands';
import { wrongCommands } from '../handlers/wrongCommands';
import { ResolverFunction } from '../types/type';

export const getResolver = (intents: Array<string>): ResolverFunction => {
  const string = intents.join('_');
  let regexResult: RegExpMatchArray = null;

  for (const key of Object.keys(commands)) {
    regexResult = string.match(key);
    if (regexResult) {
      return commands[key](regexResult);
    }
  }
  return wrongCommands;
};
