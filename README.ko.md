# QR 코드 생성기

[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md) · **한국어** · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt.md) · [Русский](README.ru.md) · [العربية](README.ar.md)

무료이며 프론트엔드만으로 동작하는 다국어 온라인 QR 코드 생성·스캔 도구입니다. 모든 QR 코드 처리는 브라우저 안에서 이루어지며 데이터를 업로드하지 않습니다. 광고와 추적 쿠키도 없습니다.

- 온라인 데모: https://qrcode.shigc.top/
- 기술 스택: 순수 HTML / CSS / JavaScript (프레임워크 없음, 백엔드 없음)
- 호스팅: 모든 정적 호스팅 (Cloudflare Pages, GitHub Pages, Netlify, Vercel 등)

## 기능

- **QR 코드 생성**: 텍스트 / URL, WiFi, vCard(명함), 이메일, SMS, 전화, 위치, 일정 8가지 유형
- **스타일 사용자 지정**: 전경색 / 배경색, 점 모양, 모서리 모양, 로고 삽입 및 불투명도, 오류 정정 수준
- **내보내기**: PNG(여러 크기) 및 SVG
- **QR 코드 스캔**: 이미지 업로드 또는 카메라 스캔
- **다국어**: 10개 언어 지원 (아랍어는 자동 RTL)
- **테마**: 라이트 / 다크 / 시스템, 설정은 `localStorage`에 저장
- **SEO / PWA**: 시맨틱 HTML, 구조화 데이터, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`

## 프로젝트 구조

```
.
├── index.html                 # QR 코드 생성 페이지
├── decode.html                # QR 코드 스캔 페이지
├── about.html                 # 소개 / 이용 약관
├── contact.html               # 문의 페이지
├── privacy.html               # 개인정보 처리방침
├── favicon.svg
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
├── build.mjs                  # 빌드: 파일 복사 + 핵심 JS 난독화 -> dist/
├── package.json
├── assets/
│   ├── css/main.css           # 모든 스타일
│   ├── js/
│   │   ├── i18n.js            # 10개 언어 UI 문구
│   │   ├── theme.js           # 테마 전환
│   │   ├── qr-generator.js    # QR 코드 생성 로직
│   │   ├── qr-decoder.js      # QR 코드 스캔 로직
│   │   └── main.js            # 공통 진입점 (내비게이션, 푸터, 초기화)
│   └── lib/
│       ├── qr-code-styling.js # QR 코드 렌더링 라이브러리
│       └── jsQR.js            # QR 코드 스캔 라이브러리
└── dist/                      # 빌드 결과물 (gitignore 대상)
```

## 로컬 개발

빌드 없이 소스를 바로 실행할 수 있습니다.

```bash
# 아무 정적 서버나 실행
python -m http.server 8080
# 또는
npm run dev
```

그다음 http://localhost:8080/ 을 여세요.

> 반드시 HTTP 서버를 통해 접속해야 합니다. `index.html`을 `file://`로 직접 열면 일부 기능이 동작하지 않습니다.

## 빌드

```bash
npm install
npm run build
```

빌드 스크립트 동작:

1. `dist/`를 삭제하고 다시 생성
2. 모든 정적 파일을 `dist/`로 복사
3. `assets/js/`의 핵심 비즈니스 코드를 [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator)로 난독화

`dist/`가 배포 대상 디렉터리입니다. `assets/lib/`의 서드파티 라이브러리는 API가 깨지지 않도록 난독화하지 않습니다.

## 배포

### Cloudflare Pages

```bash
npm run deploy
# 다음 명령과 동일: npm run build && npx wrangler pages deploy dist
```

처음 사용할 때는 `npx wrangler login`을 실행하거나, CI에서는 `CLOUDFLARE_API_TOKEN` 환경 변수로 자격 증명을 제공하세요 (**토큰을 저장소에 커밋하지 마세요**).

### GitHub Pages

```bash
npm run build
# dist/를 gh-pages 브랜치로 배포
```

모든 리소스가 상대 경로를 사용하므로 `https://<user>.github.io/qrcode/` 같은 하위 경로에서도 정상 동작합니다.

### 기타 플랫폼

`dist/` 디렉터리를 사이트 루트로 배포하면 됩니다.

## 사용자 지정

| 변경할 항목 | 위치 |
| --- | --- |
| 사이트 이름 / 로고 텍스트 | 각 HTML의 `.logo`와 `<title>`, `manifest.webmanifest` |
| 연락 이메일 | `about.html`, `contact.html`, `privacy.html`, `assets/js/i18n.js` |
| 사이트 도메인 | `robots.txt`, `sitemap.xml`, `package.json`의 `homepage` |
| UI 번역 | `assets/js/i18n.js` |
| 빌드에서 제외할 파일 | `build.mjs`의 `EXCLUDE` 집합 |

### 광고

이 프로젝트에는 **광고 코드가 포함되어 있지 않습니다**. 광고(예: Google AdSense)를 추가하려면 직접 스크립트를 넣고 해당 플랫폼의 정책을 준수해야 하며, 개인정보 처리방침도 함께 수정하세요.

## 개인정보

- QR 코드 생성과 스캔은 전부 브라우저에서 처리되며 서버로 데이터를 보내지 않습니다
- 테마와 언어 설정만 `localStorage`에 저장합니다
- 광고, 분석 스크립트, 추적 쿠키를 사용하지 않습니다

자세한 내용은 [privacy.html](privacy.html)을 참고하세요.

## 기여

이슈와 Pull Request를 환영합니다. 제출 전에 다음을 확인해 주세요.

- `npm run build`가 정상적으로 완료됨
- 데스크톱과 모바일 모두에서 정상 동작함
- 새 UI 문구는 10개 언어 모두에 추가함 (누락 시 중국어 / 영어로 대체됨)

## 라이선스

[MIT](LICENSE)

서드파티 라이선스: [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)

- [jsQR](https://github.com/cozmo/jsQR) — Apache-2.0
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) — MIT
