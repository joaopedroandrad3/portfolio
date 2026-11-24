import 'dotenv/config';

export const githubConfig = {
  username: process.env.GITHUB_USERNAME || 'joaopedroandrad3',
  token: process.env.GITHUB_TOKEN || '',
  cacheTtlMs: Number(process.env.CACHE_TTL_MINUTES || 10) * 60 * 1000,
  apiBaseUrl: 'https://api.github.com',
  userAgent: 'joao-pedro-portfolio-api/1.0',
};
