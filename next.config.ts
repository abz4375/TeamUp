import type { NextConfig } from 'next';
import { RemotePattern } from 'next/dist/shared/lib/image-config';

const NEXT_PUBLIC_SERVER_URL =
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL, 'https://team-up-one.vercel.app'].map((item) => {
        const url = new URL(item);
        return {
          protocol: url.protocol.replace(':', ''),
          hostname: url.hostname,
          pathname: '**',
        } as RemotePattern;
      }),
    ],
  },
};

export default nextConfig;
