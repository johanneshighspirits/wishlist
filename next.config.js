/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'qmq8pigttgnedxt6.public.blob.vercel-storage.com',
      },
    ],
  },
};

module.exports = nextConfig;
