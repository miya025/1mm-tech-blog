import type { APIRoute, GetStaticPaths } from 'astro';
import satori from 'satori';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import { getPosts } from '@/lib/notion/client';
import { SITE_CONFIG } from '@/site-config';

// ビルド時に静的生成（SSG）
export const prerender = true;

// WASM初期化フラグ
let wasmInitialized = false;

// WASM を初期化
async function ensureWasmInitialized(): Promise<void> {
  if (wasmInitialized) return;

  try {
    // ローカルファイルから WASM を読み込み
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const wasmPath = path.resolve(process.cwd(), 'node_modules/@resvg/resvg-wasm/index_bg.wasm');
    const wasmBuffer = await fs.readFile(wasmPath);
    await initWasm(wasmBuffer);
    wasmInitialized = true;
  } catch (error) {
    // すでに初期化済みの場合はエラーを無視
    if (error instanceof Error && error.message.includes('Already initialized')) {
      wasmInitialized = true;
      return;
    }
    throw error;
  }
}

// 全記事のパスを生成
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts();
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { title: post.title },
  }));
};

// フォントを取得（TTF形式）
// Satoriは WOFF2 に対応していないため、TTF形式を使用
async function loadFont(): Promise<ArrayBuffer> {
  // Noto Sans JP の TTF を直接取得
  // Google Fonts の TTF URL（安定したURL）
  const fontUrl = 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5.0.19/files/noto-sans-jp-japanese-700-normal.woff';

  try {
    const response = await fetch(fontUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch font: ${response.status}`);
    }
    return await response.arrayBuffer();
  } catch (error) {
    console.error('Failed to load Noto Sans JP:', error);
    // フォールバック: Inter TTF
    const fallbackUrl = 'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Bold.otf';
    const fallbackResponse = await fetch(fallbackUrl);
    return await fallbackResponse.arrayBuffer();
  }
}

export const GET: APIRoute = async ({ props }) => {
  const { title } = props as { title: string };

  // WASM を初期化
  await ensureWasmInitialized();

  const fontData = await loadFont();
  const width = 1200;
  const height = 630;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#1a1a2e',
          backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          padding: '60px 80px',
          fontFamily: 'Noto Sans JP, Inter, sans-serif',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                fontSize: title.length > 40 ? '48px' : title.length > 25 ? '56px' : '64px',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.4,
                maxWidth: '1040px',
                wordBreak: 'break-word',
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                marginTop: '40px',
                fontSize: '28px',
                color: '#94a3b8',
                fontWeight: 500,
              },
              children: SITE_CONFIG.title,
            },
          },
        ],
      },
    },
    {
      width,
      height,
      fonts: [
        {
          name: 'Noto Sans JP',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
