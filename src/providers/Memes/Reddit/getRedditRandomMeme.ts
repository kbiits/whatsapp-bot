import InvalidOptionError from '../../../exceptions/InvalidOptionError';
import { getFormattedRedditPostText, getRandomRedditPostTextOrImage } from '../../../utils/reddit';
import MemeModel from '../MemeModel';
import RedditMemeProvider from './RedditMemeProvider';

export default async function* getRedditRandomMeme(
  this: RedditMemeProvider,
  opt: string = 'new'
): AsyncGenerator<MemeModel> {
  if (!this.isValidOption(opt)) {
    throw new InvalidOptionError();
  }

  yield {
    caption: null,
    content: null,
    loading: true,
    mediaType: null,
  };
  const { data } = await this._redditClient.sendRequest(this.getRandomSubredditUrl(opt));
  const { redditPost, mediaType, mimeType, url } = getRandomRedditPostTextOrImage(data, true);
  if (mediaType === 'text') {
    throw new Error('Failed to fetch meme');
  }

  yield {
    caption: getFormattedRedditPostText(redditPost),
    content: {
      url: url!,
    },
    loading: false,
    mediaType: mediaType,
    mimeType: mimeType,
  };
}
