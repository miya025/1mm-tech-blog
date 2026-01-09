export interface Project {
    title: string;
    subtitle: string;
    description: string;
    url: string;
    params: string; // for color themes mostly, e.g., "bg-blue-50 text-blue-700"
    tags: string[];
    colorTheme: 'blue' | 'green' | 'gray';
}

// Safelist for dynamic classes:
// bg-blue-100 text-blue-700 hover:border-blue-200
// bg-green-100 text-green-700 hover:border-green-200
// bg-gray-100 text-gray-700 hover:border-gray-200

export const projects: Project[] = [
    {
        title: "コード差分翻訳ツール",
        subtitle: "ユーザー認証と外部APIを統合した実用ツール",
        description: "Next.jsとTypeScriptをベースに、Supabaseによるユーザー認証機能を備えた開発補助ツールです。OpenAI APIを統合し、コードの変更箇所（Diff）のみを抽出して自動翻訳するロジックを実装。データの永続化から高度なテキスト処理までを一貫して構築しています。",
        url: "https://diff-note.vercel.app/",
        params: "files/diff-note", // Placeholder or relevant path
        tags: ["Auth", "API連携", "Next.js", "Supabase", "OpenAI"],
        colorTheme: "blue"
    },
    {
        title: "生成AI時代のSEO（GEO）診断ツール",
        subtitle: "最新トレンド（AI検索最適化）に対応したプロトタイプ",
        description: "AI検索（GEO）を分析するための診断システムです。Astroを用いた高速なフロントエンドに加え、位置情報データやAI応答の解析ロジックを統合。複雑な設定を排し、実利的な解析結果を即座に導き出すパフォーマンスに特化した実装の一例です。",
        url: "https://ai-user-diagnosis.vercel.app/",
        params: "files/geo-diagnosis", // Placeholder
        tags: ["AI", "プロトタイプ", "Astro", "Puppeteer"],
        colorTheme: "green"
    }
];
