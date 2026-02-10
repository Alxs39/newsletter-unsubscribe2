import axios, { type AxiosInstance } from 'axios';
import { cookies } from 'next/headers';

export interface Session {
  session: { id: string; userId: string };
  user: { id: string; email: string; name: string; role: string };
}

export async function createServerApiClient(): Promise<AxiosInstance> {
  const cookieStore = await cookies();

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieStore.toString(),
    },
  });
}

export async function getSession(): Promise<Session | null> {
  try {
    const api = await createServerApiClient();
    const { data } = await api.get<Session>('/auth/get-session');
    return data?.session ? data : null;
  } catch {
    return null;
  }
}
