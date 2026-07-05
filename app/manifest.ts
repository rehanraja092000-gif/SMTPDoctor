import type { MetadataRoute } from "next";
import { SITE } from "../lib/tools";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: "Free email deliverability & DNS diagnostic tools",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0e12",
    theme_color: "#0b0e12",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
