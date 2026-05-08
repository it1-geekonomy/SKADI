/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["10.0.0.108"],
  images: {
    domains: ['images.unsplash.com'],
  },
};
module.exports = nextConfig;
