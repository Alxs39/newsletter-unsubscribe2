import type { ApplicationService } from '@adonisjs/core/types';
import { EncryptionService } from '#services/encryption_service';

export default class EncryptionProvider {
  constructor(protected app: ApplicationService) {}

  register(): void {
    this.app.container.singleton(EncryptionService, () => {
      return new EncryptionService();
    });
  }
}
