import { Mimetype, WAMediaUpload } from '@adiwajshing/baileys';

export interface JokeModel {
  media?: WAMediaUpload;
  text: string;
  mediaType?: 'video' | 'image' | 'text';
  loading: boolean;
  mimeType?: Mimetype;
}
