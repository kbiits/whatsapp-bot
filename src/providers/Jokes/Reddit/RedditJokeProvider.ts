import getRedditMediaBuffer from '../../Reddit/getRedditMediaBuffer';
import RedditProvider from '../../Reddit/RedditProvider';
import { JokeProvider } from '../Joke';
import { JokeModel } from '../JokeModel';
import getRandomJoke from './getRedditRandomJoke';

class RedditJokeProvider extends RedditProvider implements JokeProvider {
  getRandomJoke: (opt?: string) => AsyncGenerator<JokeModel>;
  subredditUrls: Array<string>;

  constructor() {
    super();
  }
}

const subredditJokeUrls = [
  'https://oauth.reddit.com/r/Jokes',
  'https://oauth.reddit.com/r/facepalm',
  'https://oauth.reddit.com/r/cleanjokes',
];

RedditJokeProvider.prototype.subredditUrls = subredditJokeUrls;
RedditJokeProvider.prototype.getMediaBuffer = getRedditMediaBuffer;
RedditJokeProvider.prototype.getRandomJoke = getRandomJoke;

export default RedditJokeProvider;
