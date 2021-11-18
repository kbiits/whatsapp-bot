import { getOneRedditPostFromListing, isRedditContainMedia } from '../../utils/reddit';
import { RedditClient } from '../RedditClient';
import { JokeProvider } from './Joke';
import { JokeModel } from './JokeModel';

const redditUrls = [
  'https://oauth.reddit.com/r/Jokes',
  'https://oauth.reddit.com/r/facepalm',
  'https://oauth.reddit.com/r/funny',
  'https://oauth.reddit.com/r/holdmybeer',
];

const getRandomRedditJokeUrl = (): string => redditUrls[Math.floor(Math.random() * redditUrls.length)];

const validOptions = new Map<string, number>([
  ['new', 1],
  ['hot', 1],
  ['top', 1],
  ['random', 1],
  ['best', 1],
]);

const validateOptions = (opt: string) => {
  if (!validOptions.has(opt)) {
    return false;
  }

  return true;
};

export class RedditJokeProvider implements JokeProvider {
  _redditClient: RedditClient;

  constructor() {
    this._redditClient = new RedditClient();
  }

  async getRandomJoke(option: string = 'new'): Promise<JokeModel> {
    let url: string = getRandomRedditJokeUrl();

    const isValidOpt = validateOptions(option);
    if (!isValidOpt) {
      throw new Error('Invalid options');
    }
    if (option == 'random') url = `${url}/random.json`;
    else url = `${url}/${option}.json?limit=1`;
    const { data } = await this._redditClient.sendRequest(url);
    const redditPost = getOneRedditPostFromListing(data);

    let caption: string;
    if (!redditPost.selftext) {
      caption = redditPost.title;
    } else {
      caption = `*${redditPost.title}*\n\n${redditPost.selftext}`;
    }

    const mediaType = isRedditContainMedia(redditPost);

    if (mediaType) {
      const bufferMedia = await this.getMediaBuffer(redditPost, mediaType);
      return {
        media: bufferMedia,
        text: caption,
        mediaType: mediaType,
      };
    } else {
      return {
        text: caption,
        mediaType: 'text',
      };
    }
  }

  async getMediaBuffer(redditPost: any, mediaType: 'image' | 'video'): Promise<Buffer> {
    let url: string;
    if (mediaType === 'image') {
      const imageObj = redditPost?.preview?.images[0];
      if (!imageObj) return null;
      url = imageObj.source.url;
    } else {
      const videoObj = redditPost?.media?.reddit_video;
      if (!videoObj) return null;
      url = videoObj.fallback_url;
    }

    if (!url) return null;
    url = url.replace('amp;', '');

    const { data } = await this._redditClient.sendRequest(url, {
      responseType: 'arraybuffer',
      method: 'GET',
    });
    return data;
  }
}
