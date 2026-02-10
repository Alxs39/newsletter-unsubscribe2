import env from '#start/env';

const redisUrl = new URL(env.get('REDIS_URL'));

export const redisConnection = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port) || 6379,
  password: redisUrl.password || undefined,
  db: Number(redisUrl.pathname.slice(1)) || 0,
};
