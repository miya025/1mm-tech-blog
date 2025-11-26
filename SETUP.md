# セットアップガイド

このファイルは開発者向けのクイックセットアップ手順です。

## 1. 環境変数の設定

```bash
cp .env.example .env
```

`.env`ファイルを編集:

```env
NOTION_TOKEN=secret_YOUR_NOTION_INTEGRATION_TOKEN
NOTION_DATABASE_ID=YOUR_DATABASE_ID
```

## 2. Notion Integration の作成手順

1. https://www.notion.so/my-integrations にアクセス
2. 「+ New integration」をクリック
3. 以下を入力:
   - Name: `My Blog Integration` (任意)
   - Associated workspace: あなたのワークスペースを選択
   - Capabilities: すべてデフォルトのまま（Read content, Update content, Insert content）
4. 「Submit」をクリック
5. **Internal Integration Token** をコピー → `.env`の`NOTION_TOKEN`に貼り付け

## 3. Notionデータベースの作成

### データベーステンプレートを使う場合

以下のURLをNotionで複製:
👉 [テンプレートURL] (※後でテンプレート公開時に追加)

### 手動で作成する場合

1. Notionで新規ページ作成
2. `/database` → 「データベース - フルページ」を選択
3. 以下のプロパティを順番に追加:

| プロパティ名 | 種類 | 設定 |
|:---|:---|:---|
| Title | タイトル | (自動生成) |
| Slug | テキスト | - |
| Status | セレクト | `Draft`, `Published` の2つを追加 |
| PublishedDate | 日付 | - |
| Tags | マルチセレクト | 好きなタグを追加 |
| Excerpt | テキスト | - |
| CoverImage | ファイル&メディア | - |
| Author | ユーザー | - |

4. データベースページの右上「...」→ 「コネクトの追加」→ 作成したIntegrationを選択
5. データベースのURLから`Database ID`を取得:
   - `https://notion.so/XXXXXXXXXX?v=YYYY` の`XXXXXXXXXX`部分
   - `.env`の`NOTION_DATABASE_ID`に貼り付け

## 4. テスト記事の作成

データベースに以下のような記事を1件作成:

- **Title**: `Getting Started`
- **Slug**: `getting-started`
- **Status**: `Published`
- **PublishedDate**: 今日の日付
- **Tags**: `Tutorial`
- **Excerpt**: `This is my first post!`
- **本文**: 見出しや段落を自由に書く

## 5. 起動

```bash
npm install
npm run dev
```

ブラウザで http://localhost:4321 を開く。

## トラブルシューティング

### エラー: "NOTION_TOKEN is not defined"

→ `.env`ファイルが存在し、プロジェクトルートにあるか確認

### エラー: "Failed to fetch posts from Notion"

→ 以下を確認:
- `NOTION_TOKEN`と`NOTION_DATABASE_ID`が正しいか
- NotionのIntegrationがデータベースに「コネクト」されているか
- データベースに`Status = Published`の記事が存在するか

### 記事は取得できるが、本文が表示されない

→ NotionのページIDを確認。データベース内の個別ページを開いて、URLから正しいIDを取得しているか確認。

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド（型チェック含む）
npm run build

# ビルド結果をローカルでプレビュー
npm run preview
```

## 次のステップ

- `src/site-config.ts`でサイト情報をカスタマイズ
- `src/layouts/Layout.astro`でデザインを調整
- `src/styles/global.css`でスタイルを変更
- Notionで記事を量産!
