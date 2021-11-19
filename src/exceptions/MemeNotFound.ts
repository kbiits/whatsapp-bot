export class MemeNotFound extends Error {
  constructor() {
    super("There's no meme for now, try again later");
  }
}
