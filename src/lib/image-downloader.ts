/**
 * image-downloader.ts - ビルド時にNotionの画像をダウンロードするユーティリティ
 *
 * Cloudflare Image Resizingを使わない場合（Freeプラン）、
 * ビルド時にNotionのS3画像をローカルにダウンロードして静的配信する。
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const PUBLIC_IMAGES_DIR = 'public/images/notion';
const DIST_IMAGES_DIR = 'dist/images/notion';

/**
 * URLからハッシュベースのファイル名を生成
 * NotionのS3 URLは署名パラメータが変わるため、ベースURLのみでハッシュ化
 */
function getHashedFilename(url: string): string {
  // S3の署名パラメータを除去してベースURLを取得
  const baseUrl = url.split('?')[0];
  const hash = crypto.createHash('md5').update(baseUrl).digest('hex').slice(0, 12);
  const ext = getExtension(baseUrl);
  return `${hash}${ext}`;
}

/**
 * URLから拡張子を取得
 */
function getExtension(url: string): string {
  const pathname = new URL(url).pathname;
  const ext = path.extname(pathname).toLowerCase();
  // 対応する拡張子のみ許可、それ以外は.jpg
  const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
  return allowedExts.includes(ext) ? ext : '.jpg';
}

/**
 * 画像をダウンロードしてローカルに保存
 * @returns ローカルパス（/images/notion/xxx.jpg形式）
 */
export async function downloadImage(url: string): Promise<string> {
  // 既にローカルパスの場合はそのまま返す
  if (url.startsWith('/')) {
    return url;
  }

  const filename = getHashedFilename(url);
  const localPath = `/images/notion/${filename}`;
  const publicPath = path.join(process.cwd(), PUBLIC_IMAGES_DIR, filename);
  const distPath = path.join(process.cwd(), DIST_IMAGES_DIR, filename);

  // 既にダウンロード済みならスキップ（distを優先チェック）
  if (fs.existsSync(distPath)) {
    return localPath;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to download image: ${url} (${response.status})`);
      return url; // フォールバック: 元のURLを返す
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // publicとdist両方に保存（Astroのビルドタイミング問題を回避）
    for (const targetPath of [publicPath, distPath]) {
      const dir = path.dirname(targetPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(targetPath, buffer);
    }

    console.log(`Downloaded: ${filename}`);
    return localPath;
  } catch (error) {
    console.warn(`Failed to download image: ${url}`, error);
    return url; // フォールバック: 元のURLを返す
  }
}

/**
 * URLからローカルパスを取得（ダウンロードなし、パス計算のみ）
 */
export function getLocalImagePath(url: string): string {
  if (url.startsWith('/')) {
    return url;
  }
  const filename = getHashedFilename(url);
  return `/images/notion/${filename}`;
}

/**
 * 画像がローカルに存在するかチェック
 */
export function imageExists(url: string): boolean {
  if (url.startsWith('/')) {
    return fs.existsSync(path.join(process.cwd(), 'public', url));
  }
  const filename = getHashedFilename(url);
  const distPath = path.join(process.cwd(), DIST_IMAGES_DIR, filename);
  const publicPath = path.join(process.cwd(), PUBLIC_IMAGES_DIR, filename);
  return fs.existsSync(distPath) || fs.existsSync(publicPath);
}

/**
 * 複数の画像を並列ダウンロード
 */
export async function downloadImages(urls: string[]): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  const uniqueUrls = [...new Set(urls.filter(url => url && !url.startsWith('/')))];

  const downloads = await Promise.all(
    uniqueUrls.map(async (url) => {
      const localPath = await downloadImage(url);
      return { url, localPath };
    })
  );

  for (const { url, localPath } of downloads) {
    results.set(url, localPath);
  }

  return results;
}
