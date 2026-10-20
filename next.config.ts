import type { NextConfig } from "next";
import assets from "./src/content/assets.generated.json";
import { site } from "./src/content/site";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
      // Shaders live in .glsl files and are imported as strings (CLAUDE.md · WebGL rules).
      "*.{glsl,vert,frag}": {
        type: "raw",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
  },
  async redirects() {
    return [
      // The PDF in public/resume once added (asset `file.resume`), the V1 resume until then.
      { source: "/resume", destination: assets["file.resume"].src ?? site.resumeFallback, permanent: false },
    ];
  },
};

export default nextConfig;
