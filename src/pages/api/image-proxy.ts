import type { APIRoute } from 'astro';

/**
 * 画像プロキシAPI
 *
 * プレビュー用にNotion画像をプロキシしてキャッシュする。
 * Notionの画像URLは約1時間で期限切れになるため、
 * このプロキシを経由することでCloudflare Edgeでキャッシュできる。
 *
 * Usage: /api/image-proxy?url=<encoded-image-url>&token=<preview-secret>
 */

export const GET: APIRoute = async ({ url, locals }) => {
  const imageUrl = url.searchParams.get('url');
  const token = url.searchParams.get('token');

  // 環境変数からシークレットを取得
  const runtime = (locals as { runtime?: { env?: Record<string, string> } }).runtime;
  const PREVIEW_SECRET = runtime?.env?.PREVIEW_SECRET ?? import.meta.env.PREVIEW_SECRET;

  // 認証チェック（プレビュー機能のみ許可）
  if (!PREVIEW_SECRET || token !== PREVIEW_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!imageUrl) {
    return new Response('Missing url parameter', { status: 400 });
  }

  // URLバリデーション（Notion S3のみ許可）
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(imageUrl);
    const allowedHosts = [
      's3.us-west-2.amazonaws.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com',
      'www.notion.so',
      'images.unsplash.com',
    ];
    if (!allowedHosts.some(host => parsedUrl.hostname.includes(host))) {
      return new Response('Invalid image URL', { status: 400 });
    }
  } catch {
    return new Response('Invalid URL format', { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return new Response(`Failed to fetch image: ${response.status}`, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageData = await response.arrayBuffer();

    // キャッシュヘッダーを設定（1時間キャッシュ）
    return new Response(imageData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'CDN-Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new Response('Failed to proxy image', { status: 500 });
  }
};
