export const getOneRedditPostFromListing = (listingObject) => {
  return listingObject.data.children[0].data;
};

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
