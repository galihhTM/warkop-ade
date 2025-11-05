/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "usable-captain-de0803351d.strapiapp.com",
      "usable-captain-de0803351d.media.strapiapp.com", // tambahkan juga domain media-nya
    ],
  },
};

export default nextConfig;
