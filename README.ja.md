# QR コードジェネレーター

[简体中文](README.md) · [English](README.en.md) · **日本語** · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt.md) · [Русский](README.ru.md) · [العربية](README.ar.md)

無料でフロントエンドのみで動作する、多言語対応のオンライン QR コード生成・読み取りツールです。QR コードの処理はすべてブラウザ内で完結し、データをアップロードしません。広告やトラッキング Cookie もありません。

- オンラインデモ：https://qrcode.shigc.top/
- 技術スタック：素の HTML / CSS / JavaScript（フレームワークなし、バックエンドなし）
- ホスティング：任意の静的ホスティング（Cloudflare Pages、GitHub Pages、Netlify、Vercel など）

## 機能

- **QR コード生成**：テキスト / URL、WiFi、vCard（名刺）、メール、SMS、電話、位置情報、予定の 8 種類
- **スタイルのカスタマイズ**：前景色 / 背景色、ドット形状、コーナー形状、ロゴ埋め込みと不透明度、誤り訂正レベル
- **エクスポート**：PNG（複数サイズ）と SVG
- **QR コード読み取り**：画像のアップロードまたはカメラでスキャン
- **多言語**：中文、English、日本語、한국어、Español、Français、Deutsch、Português、Русский、العربية（アラビア語は自動的に RTL）
- **テーマ**：ライト / ダーク / システム連動、設定は `localStorage` に保存
- **SEO / PWA**：セマンティック HTML、構造化データ、`manifest.webmanifest`、`robots.txt`、`sitemap.xml`

## プロジェクト構成

```
.
├── index.html                 # QR コード生成ページ
├── decode.html                # QR コード読み取りページ
├── about.html                 # このツールについて / 利用規約
├── contact.html               # お問い合わせ
├── privacy.html               # プライバシーポリシー
├── favicon.svg
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
├── build.mjs                  # ビルド：ファイルコピー + コア JS の難読化 -> dist/
├── package.json
├── assets/
│   ├── css/main.css           # すべてのスタイル
│   ├── js/
│   │   ├── i18n.js            # 10 言語の UI 文言
│   │   ├── theme.js           # テーマ切り替え
│   │   ├── qr-generator.js    # QR コード生成ロジック
│   │   ├── qr-decoder.js      # QR コード読み取りロジック
│   │   └── main.js            # 共通エントリ（ナビ、フッター、初期化）
│   └── lib/
│       ├── qr-code-styling.js # QR コード描画ライブラリ
│       └── jsQR.js            # QR コード読み取りライブラリ
└── dist/                      # ビルド成果物（gitignore 対象）
```

## ローカル開発

ビルドなしでソースをそのまま実行できます。

```bash
# 任意の静的サーバーを起動
python -m http.server 8080
# または
npm run dev
```

その後 http://localhost:8080/ を開いてください。

> 必ず HTTP サーバー経由でアクセスしてください。`index.html` を `file://` で直接開くと一部機能が動作しません。

## ビルド

```bash
npm install
npm run build
```

ビルドスクリプトの処理：

1. `dist/` を削除して再作成
2. すべての静的ファイルを `dist/` にコピー
3. `assets/js/` のコア業務コードを [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator) で難読化

`dist/` がデプロイ対象ディレクトリです。`assets/lib/` のサードパーティライブラリは API を壊さないよう難読化しません。

## デプロイ

### Cloudflare Pages

```bash
npm run deploy
# 次と同等：npm run build && npx wrangler pages deploy dist
```

初回は `npx wrangler login` を実行するか、CI では `CLOUDFLARE_API_TOKEN` 環境変数で認証情報を渡してください（**トークンをリポジトリにコミットしないでください**）。

### GitHub Pages

```bash
npm run build
# dist/ を gh-pages ブランチに公開
```

すべてのアセットは相対パスなので、`https://<user>.github.io/qrcode/` のようなサブパス配下でも動作します。

### その他のプラットフォーム

`dist/` ディレクトリをサイトのルートとして配信してください。

## カスタマイズ

| 変更する内容 | 場所 |
| --- | --- |
| サイト名 / ロゴ文字 | 各 HTML の `.logo` と `<title>`、`manifest.webmanifest` |
| 連絡先メール | `about.html`、`contact.html`、`privacy.html`、`assets/js/i18n.js` |
| サイトのドメイン | `robots.txt`、`sitemap.xml`、`package.json` の `homepage` |
| UI の翻訳 | `assets/js/i18n.js` |
| ビルドから除外するファイル | `build.mjs` の `EXCLUDE` セット |

### 広告

このプロジェクトには**広告コードは含まれていません**。広告（Google AdSense など）を導入する場合は、ご自身でスクリプトを追加し、各サービスのポリシーを遵守したうえで、プライバシーポリシーも更新してください。

## プライバシー

- QR コードの生成・読み取りはすべてブラウザ内で完結し、サーバーにデータを送信しません
- テーマと言語の設定のみを `localStorage` に保存します
- 広告・アクセス解析・トラッキング Cookie は使用しません

詳細は [privacy.html](privacy.html) をご覧ください。

## コントリビュート

Issue と Pull Request を歓迎します。提出前に以下をご確認ください。

- `npm run build` が正常に完了する
- デスクトップとモバイルの両方で動作する
- 新しい UI 文言は 10 言語すべてに追加する（不足時は中国語 / 英語にフォールバック）

## ライセンス

[MIT](LICENSE)

サードパーティライセンス：[THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)

- [jsQR](https://github.com/cozmo/jsQR) — Apache-2.0
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) — MIT
