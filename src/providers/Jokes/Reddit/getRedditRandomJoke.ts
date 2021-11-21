import InvalidOptionError from '../../../exceptions/InvalidOptionError';
import { getFormattedRedditPostText, getRandomRedditPostTextOrImage } from '../../../utils/reddit';
import { JokeModel } from '../JokeModel';
import RedditJokeProvider from './RedditJokeProvider';

export default async function* getRedditRandomJoke(
  this: RedditJokeProvider,
  option: string = 'new'
): AsyncGenerator<JokeModel> {
  if (!this.isValidOption(option)) {
    throw new InvalidOptionError();
  }
  const { data } = await this._redditClient.sendRequest(this.getRandomSubredditUrl(option));
  let { redditPost, mediaType, url, mimeType } = getRandomRedditPostTextOrImage(data, false);

  const caption = getFormattedRedditPostText(redditPost);

  if (mediaType !== 'text') {
    yield {
      text: null,
      loading: true,
    };
    // const bufferMedia = await this.getMediaBuffer(redditPost, mediaType);
    yield {
      media: {
        url: url,
      },
      text: caption,
      mediaType: mediaType,
      loading: false,
      mimeType,
    };
  } else {
    yield {
      text: caption,
      mediaType: 'text',
      loading: false,
    };
  }
}
