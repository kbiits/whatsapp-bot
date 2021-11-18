import { JokeModel } from './JokeModel';
import { RedditJokeProvider } from './RedditJokeProvider';

export interface JokeProvider {
  getRandomJoke(): Promise<JokeModel>;
}

type JokeProviderFactory = {
  [key: string]: () => JokeProvider;
};

const JokeProviders: JokeProviderFactory = {
  '1': (): JokeProvider => new RedditJokeProvider(),
};

export const getRandomJokeProvider = (): JokeProvider => {
  const listKeys = Object.keys(JokeProviders);
  const ConcreteQuoteProvider: JokeProvider = JokeProviders[listKeys[Math.floor(Math.random() * listKeys.length)]]();
  return ConcreteQuoteProvider;
};
