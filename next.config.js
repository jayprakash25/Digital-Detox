/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "api.producthunt.com",
        port: "",
        pathname: "**",
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

module.exports = nextConfig;
