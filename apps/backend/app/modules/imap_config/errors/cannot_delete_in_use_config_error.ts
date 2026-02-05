export default class CannotDeleteInUseConfigError extends Error {
  constructor() {
    super('Cannot delete IMAP config: it is in use by one or more provider accounts');
  }
}
