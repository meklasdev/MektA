import type { NextConfig } from "next";

const nextConfig: NextConfig = { reactStrictMode: true, output: "export", assetPrefix: "./", trailingSlash: true, pageExtensions: ["tsx", "ts", "jsx"] };
export default nextConfig;
