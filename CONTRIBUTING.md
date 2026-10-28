# Contributing

感谢你愿意为这个项目贡献代码！请先阅读以下约定。

## 开发流程

1. Fork 本仓库并克隆到本地
2. 创建分支：`git checkout -b feat/your-feature`
3. 本地预览：`python -m http.server 8080`（或 `npm run dev`）
4. 提交前确认构建通过：`npm install && npm run build`
5. 提交 Pull Request，并描述改动内容与测试方式

## 代码约定

- HTML：ID 与 class 使用 kebab-case
- JavaScript：变量与函数使用 camelCase，使用原生 ES2018+ 语法
- CSS：类名使用 kebab-case，按区块组织并加注释
- 文案：使用 `data-i18n` 属性，词条写在 `assets/js/i18n.js`，key 使用点号命名（如 `gen.title`）

## 多语言

新增或修改界面文案时，请同步更新 `assets/js/i18n.js` 中的 10 种语言（zh / en / ja / ko / es / fr / de / pt / ru / ar）。若无法翻译全部语言，至少提供中文与英文，其余可暂时留空或复用英文。

阿拉伯语（`ar`）需要 RTL 布局，请在改动布局时检查。

## 提交信息

推荐使用 [Conventional Commits](https://www.conventionalcommits.org/)：

```
feat: add batch QR generation
fix: correct WiFi QR escaping
docs: update deployment guide
```

## 注意事项

- 请勿提交 `node_modules/`、`dist/` 或任何密钥、令牌、账户 ID
- 所有二维码处理必须保持纯前端，不得引入上传用户数据的逻辑
- 请勿在未说明的情况下引入新的运行时依赖
