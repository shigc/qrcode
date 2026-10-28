# QR Code Generator

[简体中文](README.md) · **English** · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt.md) · [Русский](README.ru.md) · [العربية](README.ar.md)

A free, client-side, multilingual online QR code generator and decoder. All QR processing happens locally in your browser — no data is uploaded, no ads, and no tracking cookies.

- Live demo: https://qrcode.shigc.top/
- Tech stack: vanilla HTML / CSS / JavaScript, no framework, no backend
- Hosting: any static host (Cloudflare Pages, GitHub Pages, Netlify, Vercel, etc.)

## Features

- **QR generation**: 8 types — text / URL, WiFi, vCard, email, SMS, phone, location, event
- **Style customization**: foreground / background colors, dot style, corner style, logo embedding with opacity, error correction level
- **Export**: PNG (multiple sizes) and SVG
- **QR decoding**: upload an image or scan with your camera
- **Multilingual**: 简体中文, English, 日本語, 한국어, Español, Français, Deutsch, Português, Русский, العربية (automatic RTL for Arabic)
- **Theme**: light / dark / system, preference stored in `localStorage`
- **SEO / PWA**: semantic HTML, structured data, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`

## Project structure

```
.
├── index.html                 # QR code generator
├── decode.html                # QR code decoder
├── about.html                 # About / terms of service
├── contact.html               # Contact page
├── privacy.html               # Privacy policy
├── favicon.svg
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
├── build.mjs                  # Build: copy files + obfuscate core JS -> dist/
├── package.json
├── assets/
│   ├── css/main.css           # All styles
│   ├── js/
│   │   ├── i18n.js            # UI strings for 10 languages
│   │   ├── theme.js           # Theme switching
│   │   ├── qr-generator.js    # QR generation logic
│   │   ├── qr-decoder.js      # QR decoding logic
│   │   └── main.js            # Shared entry (nav, footer, init)
│   └── lib/
│       ├── qr-code-styling.js # QR rendering library
│       └── jsQR.js            # QR decoding library
└── dist/                      # Build output (gitignored)
```

## Local development

The source runs directly without a build step:

```bash
# pick any static server
python -m http.server 8080
# or
npm run dev
```

Then open http://localhost:8080/.

> You must use an HTTP server. Opening `index.html` directly via `file://` will break some features.

## Build

```bash
npm install
npm run build
```

The build script will:

1. Clear and recreate `dist/`
2. Copy every static asset into `dist/`
3. Obfuscate the core business logic in `assets/js/` with [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator)

`dist/` is the directory you deploy. Third-party libraries in `assets/lib/` are intentionally not obfuscated so their APIs keep working.

## Deployment

### Cloudflare Pages

```bash
npm run deploy
# equivalent to: npm run build && npx wrangler pages deploy dist
```

On first use, run `npx wrangler login`, or provide credentials through the `CLOUDFLARE_API_TOKEN` environment variable in CI (**never commit the token**).

### GitHub Pages

```bash
npm run build
# publish dist/ to the gh-pages branch
```

All assets use relative paths, so the site also works under a sub-path such as `https://<user>.github.io/qrcode/`.

### Other platforms

Use the `dist/` directory as the site root.

## Customization

| What to change | Where |
| --- | --- |
| Site name / logo text | `.logo` and `<title>` in each HTML file, `manifest.webmanifest` |
| Contact email | `about.html`, `contact.html`, `privacy.html`, and `assets/js/i18n.js` |
| Site domain | `robots.txt`, `sitemap.xml`, `homepage` in `package.json` |
| UI translations | `assets/js/i18n.js` |
| Files excluded from the build | the `EXCLUDE` set in `build.mjs` |

### Ads

This project contains **no ad code**. If you want to add ads (for example Google AdSense), add the script yourself, comply with the provider's policies, and remember to update the privacy policy.

## Privacy

- QR generation and decoding happen entirely in your browser; no data is sent to a server
- Only `localStorage` is used to remember theme and language preferences
- No ads, no analytics, no tracking cookies

See [privacy.html](privacy.html) for details.

## Contributing

Issues and pull requests are welcome. Before submitting, please make sure:

- `npm run build` completes successfully
- Changes work on both desktop and mobile
- New UI strings are added to all 10 languages (missing keys fall back to Chinese / English)

## License

[MIT](LICENSE)

Third-party licenses: [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)

- [jsQR](https://github.com/cozmo/jsQR) — Apache-2.0
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) — MIT
