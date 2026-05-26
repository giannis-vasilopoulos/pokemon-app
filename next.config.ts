import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: process.env.NODE_ENV === 'production',
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/PokeAPI/sprites/**',
      },
    ],
  },
};

export default nextConfig;
