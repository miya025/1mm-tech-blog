import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://miyadev.com', // ユーザーが変更する
  output: 'server', // Pro版: SSR + API Routes (Edge Functions)
  trailingSlash: 'ignore', // リダイレクトループ回避のため変更
  build: {
    format: 'file', // 「フォルダ/index.html」ではなく「名前.html」として生成（Cloudflare 308リダイレクト対策）
  },
  adapter: cloudflare({
    imageService: 'cloudflare', // Cloudflare Image Resizing を利用
  }),
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
