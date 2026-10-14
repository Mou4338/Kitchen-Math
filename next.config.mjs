/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The Guides page now lives inside Help.
  async redirects() {
    return [{ source: "/restaurant/guides", destination: "/restaurant/help#guides", permanent: true }];
  },
  transpilePackages: ["geist"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
};

export default nextConfig;
