import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com', // ユーザーが変更する
  output: 'static', // Free版は完全静的
  integrations: [
    tailwind({
      applyBaseStyles: false, // カスタムスタイルを優先
    }),
    sitemap(),
  ],
  vite: {
    optimizeDeps: {
      exclude: ['@notionhq/client'],
    },
  },
});
