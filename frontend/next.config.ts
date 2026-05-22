import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "www.plug.tech" },
      { protocol: "https", hostname: "gemini.google.com" },
      { protocol: "https", hostname: "th.bing.com" },
      { protocol: "https", hostname: "static.vecteezy.com" },
      { protocol: "https", hostname: "tse3.mm.bing.net" },
      { protocol: "https", hostname: "shop.plug.tech" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "localhost" },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
