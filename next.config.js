/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "http://supabasekong-dgs0g8gwgs8s8kg08ss4k8gk.135.181.108.171.sslip.io",
      "images.unsplash.com",
      "plus.unsplash.com",
    ],
  },
  experimental: {
    instrumentationHook: true,
    serverComponentsExternalPackages: ["pino", "pino-pretty"],
  },
};

module.exports = nextConfig;
