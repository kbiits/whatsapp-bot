import { Mimetype, WAMediaUpload } from '@adiwajshing/baileys';

export default interface MemeModel {
  content: WAMediaUpload;
  caption: string;
  loading: boolean;
  mediaType: 'video' | 'image';
  mimeType?: Mimetype;
}
