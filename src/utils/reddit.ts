import { Mimetype } from '@adiwajshing/baileys';
import { URL } from 'url';

export const isRedditContainMedia = (post: any): 'image' | 'video' | false => {
  if (post.is_video) {
    return 'video';
  }

  if (post.post_hint)
    if (post.post_hint.match('video')) {
      return 'video';
    } else if (post.post_hint.match('image')) {
      return 'image';
    }

  return false;
};

export const getRandomRedditPostTextOrImage = (
  data: any,
  onlyImage: boolean = false
): {
  redditPost: any;
  mediaType: 'image' | 'video' | 'text';
  url?: string;
  mimeType?: Mimetype;
} => {
  if (!Array.isArray(data?.data?.children)) {
    throw new Error('Failed to get reddit post/submission');
  }
  let redditPost: any;

  let jokesLength: number = data?.data?.children?.length;
  let mediaType: 'image' | 'video' | 'text' = 'text';
  let url: string;
  let mimeType: Mimetype;

  while (jokesLength > 0) {
    const randIdx = Math.floor(Math.random() * jokesLength);
    const joke = data.data.children[randIdx]?.data;
    const post_hint = joke.post_hint;
    const bool =
      !joke ||
      joke.pinned ||
      joke.is_created_from_ads_ui ||
      (onlyImage && (post_hint?.indexOf('image') ?? -1) === -1) ||
      joke?.whitelist_status?.indexOf('nsfw') !== -1 ||
      (post_hint?.indexOf('video') ?? -1) !== -1;

    if (bool) {
      data.data.children.splice(randIdx, 1);
      jokesLength = data.data.children.length;
      continue;
    }

    if (joke.post_hint === 'image') {
      const tempUrl: string = joke.url_overridden_by_dest!;
      const lastIdx: number = tempUrl.length - 1;
      const ext = tempUrl.slice(lastIdx - 4, lastIdx);
      if (ext.endsWith('jpg') || ext.endsWith('jpeg')) {
        mimeType = Mimetype.jpeg;
      } else if (ext.endsWith('gif')) {
        mimeType = Mimetype.gif;
      }
      mediaType = 'image';
      url = joke.url_overridden_by_dest;
    } else {
      mediaType = 'text';
    }
    redditPost = joke;
    break;
  }
  if (!redditPost) throw new Error('Failed to fetch reddit submission');

  return {
    redditPost: redditPost,
    mediaType: mediaType,
    url: url,
    mimeType,
  };
};

export const getFormattedRedditPostText = (rPost: any): string => {
  let caption: string;
  if (!rPost.selftext) {
    caption = rPost.title;
  } else {
    caption = `*${rPost.title}*\n\n${rPost.selftext}`;
  }
  return caption;
};
