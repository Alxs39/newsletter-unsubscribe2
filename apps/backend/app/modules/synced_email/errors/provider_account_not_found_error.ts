export default class ProviderAccountNotFoundError extends Error {
  constructor() {
    super('Provider account not found');
  }
}
