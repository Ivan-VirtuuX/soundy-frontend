/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [
      "res.cloudinary.com",
      "upload.wikimedia.org",
      "kpopmerchandiseguide.com",
      "news.koreadaily.com",
    ],
  },
};

module.exports = nextConfig;
