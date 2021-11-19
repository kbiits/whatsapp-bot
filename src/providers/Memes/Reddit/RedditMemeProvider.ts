import RedditProvider from '../../Reddit/RedditProvider';
import { MemeProvider } from '../Meme';
import MemeModel from '../MemeModel';
import getRedditRandomMeme from './getRedditRandomMeme';

class RedditMemeProvider extends RedditProvider implements MemeProvider {
  getRandomMeme: (opt?: string) => AsyncGenerator<MemeModel>;
  subredditUrls: Array<string>;
}

const subredditMemeUrls = [
  'https://oauth.reddit.com/r/wholesomememes',
  'https://oauth.reddit.com/r/cleanmemes',
  'https://oauth.reddit.com/r/meme',
  'https://oauth.reddit.com/r/memes',
  'https://oauth.reddit.com/r/PrequelMemes',
  'https://oauth.reddit.com/r/terriblefacebookmemes',
];

RedditMemeProvider.prototype.subredditUrls = subredditMemeUrls;
RedditMemeProvider.prototype.getRandomMeme = getRedditRandomMeme;

export default RedditMemeProvider;
