/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  // swcMinify: true,
  compress: true,
};

module.exports = nextConfig;
