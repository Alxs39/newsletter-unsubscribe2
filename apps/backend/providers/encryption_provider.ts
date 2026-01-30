import type { ApplicationService } from '@adonisjs/core/types';
import { EncryptionService } from '../app/services/encryption_service.js';

export default class EncryptionProvider {
  constructor(protected app: ApplicationService) {}

  register(): void {
    this.app.container.singleton(EncryptionService, () => {
      return new EncryptionService();
    });
  }
}
