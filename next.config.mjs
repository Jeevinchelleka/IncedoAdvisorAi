/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  // Allow images from external sources if needed
  images: {
    unoptimized: true,
  },

  // Silence build warnings for missing env vars during CI
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://advsiorai-backend-production.up.railway.app",
  },
};

export default nextConfig;
