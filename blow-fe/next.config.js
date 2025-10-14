/** @type {import('next').NextConfig} */
const imageHosts = (process.env.NEXT_PUBLIC_IMAGE_HOSTS || '')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);

const defaultImageHosts = imageHosts.length > 0 ? imageHosts : ['api.blow.ru'];

const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml',
      },
    ];
  },
  images: {
    remotePatterns: defaultImageHosts.map((hostname) => ({
      protocol: process.env.NEXT_PUBLIC_IMAGE_PROTOCOL || 'https',
      hostname,
      port: '',
      pathname: '**',
    })),
  },
};

module.exports = nextConfig;
