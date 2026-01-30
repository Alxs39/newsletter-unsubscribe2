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

router
  .group(() => {
    // Provider accounts routes
    router.post('/provider-accounts', [ProviderAccountsController, 'store']);
    router.get('/provider-accounts', [ProviderAccountsController, 'findAll']);
  })
  .use(middleware.auth());
