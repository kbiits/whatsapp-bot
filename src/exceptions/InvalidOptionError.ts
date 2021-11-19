export default class InvalidOptionError extends Error {
  constructor() {
    super('Invalid options');
    this.name = 'Invalid Option Error';
  }
}
