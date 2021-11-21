import RedditProvider from './RedditProvider';

export default async function getRedditMediaBuffer(
  this: RedditProvider,
  redditPost: any,
  mediaType: 'image' | 'video',
  url: string = null
): Promise<Buffer> {
  if (!url)
    if (mediaType === 'image') {
      const imageUrl = redditPost?.url_overridden_by_dest;
      if (!imageUrl) return null;
      url = imageUrl;
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
