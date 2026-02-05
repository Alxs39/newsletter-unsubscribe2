export default class CantConnectImapError extends Error {
  constructor(code?: string) {
    switch (code) {
      case 'NoConnection':
        super('No connection could be made to the IMAP server');
        break;
      case 'CONNECT_TIMEOUT':
        super('Connection to IMAP server timed out');
        break;
      case 'GREETING_TIMEOUT':
        super('Server took too long to respond');
        break;
      case 'EConnectionClosed':
        super('Connection to IMAP server closed unexpectedly');
        break;
      default:
        super('Cannot connect to IMAP server');
    }
  }
}
