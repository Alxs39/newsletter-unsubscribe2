import { createAuthClient } from 'better-auth/react';
import { adminClient } from 'better-auth/client/plugins';

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  basePath: '/auth',
  plugins: [adminClient()],
});

export default authClient;
