import MemeModel from './MemeModel';
import RedditMemeProvider from './Reddit/RedditMemeProvider';

export interface MemeProvider {
  getRandomMeme: (opt?: string) => AsyncGenerator<MemeModel>;
}

interface MemeFactory {
  [key: string]: () => MemeProvider;
}

const MemeProviders: MemeFactory = {
  '1': () => new RedditMemeProvider(),
};

export const getRandomMemeProvider = (): MemeProvider => {
  const listKeys = Object.keys(MemeProviders);
  const ConcreteMemeProvider: MemeProvider = MemeProviders[listKeys[Math.floor(Math.random() * listKeys.length)]]();
  return ConcreteMemeProvider;
};
