# مولد رموز QR

[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt.md) · [Русский](README.ru.md) · **العربية**

أداة مجانية متعددة اللغات تعمل بالكامل في المتصفح لإنشاء وقراءة رموز QR. تتم جميع العمليات محليًا: لا يتم رفع أي بيانات، ولا توجد إعلانات أو ملفات تعريف ارتباط للتتبع.

- عرض مباشر: https://qrcode.shigc.top/
- التقنيات: HTML / CSS / JavaScript خالص، بدون إطار عمل وبدون خادم خلفي
- الاستضافة: أي استضافة ثابتة (Cloudflare Pages، GitHub Pages، Netlify، Vercel، إلخ)

## الميزات

- **إنشاء رموز QR**: 8 أنواع — نص / رابط، WiFi، vCard، بريد إلكتروني، SMS، هاتف، موقع، حدث
- **تخصيص المظهر**: ألوان المقدمة والخلفية، شكل النقاط، شكل الزوايا، تضمين الشعار مع الشفافية، مستوى تصحيح الأخطاء
- **التصدير**: PNG (أحجام متعددة) و SVG
- **قراءة رموز QR**: رفع صورة أو المسح بالكاميرا
- **متعدد اللغات**: 10 لغات (العربية مع دعم RTL تلقائي)
- **المظهر**: فاتح / داكن / حسب النظام، محفوظ في `localStorage`
- **SEO / PWA**: HTML دلالي، بيانات منظمة، `manifest.webmanifest`، `robots.txt`، `sitemap.xml`

## هيكل المشروع

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

## التطوير المحلي

يعمل الكود المصدري مباشرة دون خطوة بناء:

```bash
# use any static server
python -m http.server 8080
# or
npm run dev
```

ثم افتح http://localhost:8080/.

> يجب الوصول عبر خادم HTTP. فتح `index.html` مباشرة عبر `file://` سيعطّل بعض الميزات.

## البناء

```bash
npm install
npm run build
```

يقوم سكربت البناء بما يلي:

1. حذف `dist/` وإعادة إنشائه
2. نسخ جميع الملفات الثابتة إلى `dist/`
3. تشويش الكود الأساسي في `assets/js/` باستخدام [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator)

`dist/` هو المجلد الذي يتم نشره. لا يتم تشويش المكتبات في `assets/lib/` للحفاظ على واجهات API الخاصة بها.

## النشر

### Cloudflare Pages

```bash
npm run deploy
# equivalent to: npm run build && npx wrangler pages deploy dist
```

في المرة الأولى نفّذ `npx wrangler login`، أو في CI وفّر بيانات الاعتماد عبر متغير البيئة `CLOUDFLARE_API_TOKEN` (**لا تُودِع الرمز في المستودع أبدًا**).

### GitHub Pages

```bash
npm run build
# publish dist/ to the gh-pages branch
```

تستخدم جميع الموارد مسارات نسبية، لذا يعمل الموقع أيضًا تحت مسار فرعي مثل `https://<user>.github.io/qrcode/`.

### منصات أخرى

استخدم مجلد `dist/` كجذر للموقع.

## التخصيص

| ما تريد تغييره | أين |
| --- | --- |
| اسم الموقع / نص الشعار | `.logo` و `<title>` في كل ملف HTML، و`manifest.webmanifest` |
| بريد التواصل | `about.html` و`contact.html` و`privacy.html` و`assets/js/i18n.js` |
| نطاق الموقع | `robots.txt` و`sitemap.xml` و`homepage` في `package.json` |
| ترجمات الواجهة | `assets/js/i18n.js` |
| الملفات المستبعدة من البناء | مجموعة `EXCLUDE` في `build.mjs` |

### الإعلانات

لا يحتوي هذا المشروع على **أي كود إعلاني**. إذا أردت إضافة إعلانات (مثل Google AdSense)، أضف السكربت بنفسك، والتزم بسياسات المزوّد، وحدّث سياسة الخصوصية أيضًا.

## الخصوصية

- يتم إنشاء وقراءة رموز QR بالكامل داخل المتصفح، ولا تُرسل أي بيانات إلى خادم
- يُستخدم `localStorage` فقط لحفظ تفضيلات المظهر واللغة
- لا إعلانات ولا أدوات تحليل ولا ملفات تعريف ارتباط للتتبع

راجع [privacy.html](privacy.html) للمزيد من التفاصيل.

## المساهمة

نرحّب بـ Issues و Pull Requests. قبل الإرسال تأكد من:

- أن `npm run build` يكتمل بنجاح
- أن التغييرات تعمل على سطح المكتب والجوال
- إضافة نصوص الواجهة الجديدة إلى اللغات العشر (المفاتيح المفقودة ترجع إلى الصينية / الإنجليزية)

## الترخيص

[MIT](LICENSE)

تراخيص الأطراف الثالثة: [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)

- [jsQR](https://github.com/cozmo/jsQR) — Apache-2.0
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) — MIT
