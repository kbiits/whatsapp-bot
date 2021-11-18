export interface JokeModel {
  media?: Buffer;
  text: string;
  mediaType?: 'video' | 'image' | 'text';
}
