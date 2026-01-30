import { createAuthClient } from 'better-auth/react';

export default createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  basePath: '/auth',
});
