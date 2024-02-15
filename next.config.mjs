/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "picsum.photos",
      },
      {
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
