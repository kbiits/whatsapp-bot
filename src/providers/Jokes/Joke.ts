import { JokeModel } from './JokeModel';
import RedditJokeProvider from './Reddit/RedditJokeProvider';

export interface JokeProvider {
  getRandomJoke: (opt?: string) => AsyncGenerator<JokeModel>;
}

type JokeProviderFactory = {
  [key: string]: () => JokeProvider;
};

const JokeProviders: JokeProviderFactory = {
  '1': (): JokeProvider => new RedditJokeProvider(),
};

export const getRandomJokeProvider = (): JokeProvider => {
  const listKeys = Object.keys(JokeProviders);
  const ConcreteJokeProvider: JokeProvider = JokeProviders[listKeys[Math.floor(Math.random() * listKeys.length)]]();
  return ConcreteJokeProvider;
};
