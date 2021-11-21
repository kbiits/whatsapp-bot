import { RedditClient } from '../RedditClient';
import getRedditMediaBuffer from './getRedditMediaBuffer';

export default abstract class RedditProvider {
  _redditClient: RedditClient;
  getMediaBuffer: typeof getRedditMediaBuffer;
  abstract subredditUrls: Array<string>;
  getRandomSubredditUrl(opt: string) {
    let url = this.subredditUrls[Math.floor(Math.random() * this.subredditUrls.length)];
    if (opt == 'random') url = `${url}/random.json`;
    else url = `${url}/${opt}.json`;

    return url;
  }

  validOptions = new Map<string, number>([
    ['new', 1],
    ['hot', 1],
    ['top', 1],
    ['best', 1],
  ]);

  isValidOption(opt: string) {
    return this.validOptions.has(opt);
  }

  constructor() {
    this._redditClient = new RedditClient();
  }
}

RedditProvider.prototype.getMediaBuffer = getRedditMediaBuffer;
