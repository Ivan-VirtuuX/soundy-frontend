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
      "static.wikia.nocookie.net",
    ],
  },
};

module.exports = nextConfig;
