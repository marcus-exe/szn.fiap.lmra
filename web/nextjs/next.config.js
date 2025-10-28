/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_USERS: process.env.NEXT_PUBLIC_API_USERS || 'http://localhost:8080',
    NEXT_PUBLIC_API_TICKETS: process.env.NEXT_PUBLIC_API_TICKETS || 'http://localhost:8081',
    NEXT_PUBLIC_API_AI: process.env.NEXT_PUBLIC_API_AI || 'http://localhost:8082'
  }
};

module.exports = nextConfig;

