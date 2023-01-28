import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  output: "server",
  site: "https://joshbutler.pages.dev",
  adapter: cloudflare(),
  integrations: [tailwind(), mdx(), sitemap()],
});
