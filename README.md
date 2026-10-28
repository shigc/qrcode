# QR Code Generator

**简体中文** · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt.md) · [Русский](README.ru.md) · [العربية](README.ar.md)

一个免费、纯前端、多语言的在线二维码生成与解码工具。所有二维码处理都在浏览器本地完成，不上传任何数据，不含广告，也不使用追踪 Cookie。

- 在线体验：https://qrcode.shigc.top/
- 技术栈：原生 HTML / CSS / JavaScript，无框架、无后端
- 部署：任意静态托管（Cloudflare Pages、GitHub Pages、Netlify、Vercel 等）

## 功能

- **二维码生成**：文本 / URL、WiFi、名片（vCard）、邮件、短信、电话、位置、日程 8 种类型
- **样式自定义**：前景色 / 背景色、点型、角型、Logo 嵌入及不透明度、容错率
- **导出**：PNG（多种尺寸）与 SVG 矢量图
- **二维码解码**：上传图片或调用摄像头扫码
- **多语言**：中文、English、日本語、한국어、Español、Français、Deutsch、Português、Русский、العربية（阿拉伯语自动 RTL）
- **主题**：浅色 / 深色 / 跟随系统，偏好保存在 `localStorage`
- **SEO / PWA**：语义化 HTML、结构化数据、`manifest.webmanifest`、`robots.txt`、`sitemap.xml`

## 项目结构

```
.
├── index.html                 # 二维码生成器
├── decode.html                # 二维码解码器
├── about.html                 # 关于 / 服务条款
├── contact.html               # 联系方式
├── privacy.html               # 隐私政策
├── favicon.svg
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
├── build.mjs                  # 构建脚本：复制文件 + 混淆核心 JS -> dist/
├── package.json
├── assets/
│   ├── css/main.css           # 全部样式
│   ├── js/
│   │   ├── i18n.js            # 10 种语言词条
│   │   ├── theme.js           # 主题切换
│   │   ├── qr-generator.js    # 生成逻辑
│   │   ├── qr-decoder.js      # 解码逻辑
│   │   └── main.js            # 公共入口（导航、页脚、初始化）
│   └── lib/
│       ├── qr-code-styling.js # 二维码渲染库
│       └── jsQR.js            # 二维码解码库
└── dist/                      # 构建产物（已 gitignore）
```

## 本地开发

源码无需构建即可直接运行：

```bash
# 任选一种方式启动静态服务器
python -m http.server 8080
# 或
npm run dev
```

然后打开 http://localhost:8080/ 。

> 必须通过 HTTP 服务器访问，直接双击 `index.html`（`file://`）会导致部分功能异常。

## 构建

```bash
npm install
npm run build
```

构建脚本会：

1. 清空并重建 `dist/`
2. 复制全部静态资源到 `dist/`
3. 用 [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator) 混淆 `assets/js/` 下的核心业务代码

`dist/` 是最终部署目录。第三方库（`assets/lib/`）不做混淆，以保证 API 正常。

## 部署

### Cloudflare Pages

```bash
npm run deploy
# 等价于：npm run build && npx wrangler pages deploy dist
```

首次使用需先 `npx wrangler login`，或在 CI 中通过 `CLOUDFLARE_API_TOKEN` 环境变量提供凭据（**不要把 token 写进仓库**）。

### GitHub Pages

```bash
npm run build
# 将 dist/ 发布到 gh-pages 分支
```

页面内所有资源均使用相对路径，因此部署在子路径（如 `https://<user>.github.io/qrcode/`）下也能正常工作。

### 其他平台

把 `dist/` 目录作为静态站点根目录即可。

## 自定义

| 需要修改的内容 | 位置 |
| --- | --- |
| 站点名称 / Logo 文字 | 各 HTML 的 `.logo` 与 `<title>`、`manifest.webmanifest` |
| 联系邮箱 | `about.html`、`contact.html`、`privacy.html` 与 `assets/js/i18n.js` |
| 站点域名 | `robots.txt`、`sitemap.xml`、`package.json` 的 `homepage` |
| 语言文案 | `assets/js/i18n.js` |
| 构建时排除的文件 | `build.mjs` 中的 `EXCLUDE` 集合 |

### 广告

本项目**不包含任何广告代码**。如需接入广告（例如 Google AdSense），请自行在 HTML 中加入脚本并遵守相应平台的政策，同时记得更新隐私政策。

## 隐私

- 二维码生成与解码完全在浏览器本地完成，不发送任何数据到服务器
- 仅使用 `localStorage` 保存主题与语言偏好
- 不使用广告、不使用统计脚本、不设置追踪 Cookie

详见 [privacy.html](privacy.html)。

## 贡献

欢迎提交 Issue 和 Pull Request。提交前请确保：

- `npm run build` 能正常完成
- 改动在桌面端与移动端均可正常使用
- 新增文案同时补充到 10 种语言（缺失时会回退到中文/英文）

## 许可证

[MIT](LICENSE)

第三方库的许可证见 [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)：

- [jsQR](https://github.com/cozmo/jsQR) — Apache-2.0
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) — MIT
