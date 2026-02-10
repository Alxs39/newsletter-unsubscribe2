/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';
const ProviderAccountsController = () =>
  import('#modules/provider_account/provider_accounts_controller');
const SyncedEmailsController = () => import('#modules/synced_email/synced_emails_controller');
const ImapConfigsController = () => import('#modules/imap_config/imap_configs_controller');
const ImapConfigsAdminController = () =>
  import('#modules/imap_config/imap_configs_admin_controller');

router
  .group(() => {
    // IMAP configs routes (read-only for users)
    router.get('/imap-configs', [ImapConfigsController, 'list']);

    // Provider accounts routes
    router.post('/provider-accounts', [ProviderAccountsController, 'store']);
    router.get('/provider-accounts', [ProviderAccountsController, 'findAll']);

    // Synced emails routes
    router.post('/synced-emails/sync', [SyncedEmailsController, 'sync']);
    router.get('/synced-emails', [SyncedEmailsController, 'findAll']);
  })
  .use(middleware.auth());

// Admin routes
router
  .group(() => {
    router.get('/imap-configs', [ImapConfigsAdminController, 'list']);
    router.post('/imap-configs', [ImapConfigsAdminController, 'create']);
    router.patch('/imap-configs/:id', [ImapConfigsAdminController, 'update']);
    router.delete('/imap-configs/:id', [ImapConfigsAdminController, 'delete']);
  })
  .prefix('/admin')
  .use([middleware.auth(), middleware.admin()]);
