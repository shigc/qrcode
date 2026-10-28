# QR-Code-Generator

[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · **Deutsch** · [Português](README.pt.md) · [Русский](README.ru.md) · [العربية](README.ar.md)

Kostenloses, rein clientseitiges, mehrsprachiges Online-Tool zum Erzeugen und Lesen von QR-Codes. Die gesamte Verarbeitung findet im Browser statt: Es werden keine Daten hochgeladen, keine Werbung und keine Tracking-Cookies.

- Live-Demo: https://qrcode.shigc.top/
- Tech-Stack: reines HTML / CSS / JavaScript, kein Framework, kein Backend
- Hosting: beliebiges statisches Hosting (Cloudflare Pages, GitHub Pages, Netlify, Vercel usw.)

## Funktionen

- **QR-Code-Erzeugung**: 8 Typen — Text / URL, WiFi, vCard, E-Mail, SMS, Telefon, Standort, Termin
- **Stil-Anpassung**: Vorder- / Hintergrundfarbe, Punktstil, Eckenstil, Logo mit Deckkraft, Fehlerkorrekturstufe
- **Export**: PNG (mehrere Größen) und SVG
- **QR-Code-Lesen**: Bild hochladen oder mit der Kamera scannen
- **Mehrsprachig**: 10 Sprachen (Arabisch automatisch RTL)
- **Design**: Hell / Dunkel / System, gespeichert in `localStorage`
- **SEO / PWA**: semantisches HTML, strukturierte Daten, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`

## Projektstruktur

```
.
├── index.html                 # QR-Code-Generator
├── decode.html                # QR-Code-Leser
├── about.html                 # Über / Nutzungsbedingungen
├── contact.html               # Kontaktseite
├── privacy.html               # Datenschutzerklärung
├── favicon.svg
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
├── build.mjs                  # Build: Dateien kopieren + Kern-JS obfuskieren -> dist/
├── package.json
├── assets/
│   ├── css/main.css           # Alle Styles
│   ├── js/
│   │   ├── i18n.js            # UI-Texte für 10 Sprachen
│   │   ├── theme.js           # Theme-Umschaltung
│   │   ├── qr-generator.js    # QR-Erzeugungslogik
│   │   ├── qr-decoder.js      # QR-Leselogik
│   │   └── main.js            # Gemeinsamer Einstiegspunkt (Navigation, Footer, Init)
│   └── lib/
│       ├── qr-code-styling.js # QR-Rendering-Bibliothek
│       └── jsQR.js            # QR-Lese-Bibliothek
└── dist/                      # Build-Ausgabe (in .gitignore)
```

## Lokale Entwicklung

Der Quellcode läuft direkt ohne Build:

```bash
# beliebigen statischen Server starten
python -m http.server 8080
# oder
npm run dev
```

Danach http://localhost:8080/ öffnen.

> Der Zugriff muss über einen HTTP-Server erfolgen. Wird `index.html` direkt per `file://` geöffnet, funktionieren einige Funktionen nicht.

## Build

```bash
npm install
npm run build
```

Das Build-Skript:

1. Löscht und erstellt `dist/` neu
2. Kopiert alle statischen Dateien nach `dist/`
3. Obfuskiert den Kern-Business-Code in `assets/js/` mit [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator)

`dist/` ist das Verzeichnis zum Deployment. Bibliotheken in `assets/lib/` werden nicht obfuskiert, damit ihre APIs erhalten bleiben.

## Bereitstellung

### Cloudflare Pages

```bash
npm run deploy
# entspricht: npm run build && npx wrangler pages deploy dist
```

Beim ersten Mal `npx wrangler login` ausführen oder in CI die Zugangsdaten über die Umgebungsvariable `CLOUDFLARE_API_TOKEN` bereitstellen (**Token niemals committen**).

### GitHub Pages

```bash
npm run build
# dist/ in den gh-pages-Branch veröffentlichen
```

Alle Assets verwenden relative Pfade, daher funktioniert die Seite auch unter einem Unterpfad wie `https://<user>.github.io/qrcode/`.

### Andere Plattformen

Das Verzeichnis `dist/` als Site-Root ausliefern.

## Anpassung

| Was ändern | Wo |
| --- | --- |
| Seitenname / Logo-Text | `.logo` und `<title>` in jeder HTML-Datei, `manifest.webmanifest` |
| Kontakt-E-Mail | `about.html`, `contact.html`, `privacy.html` und `assets/js/i18n.js` |
| Domain der Seite | `robots.txt`, `sitemap.xml`, `homepage` in `package.json` |
| UI-Übersetzungen | `assets/js/i18n.js` |
| Vom Build ausgeschlossene Dateien | das `EXCLUDE`-Set in `build.mjs` |

### Werbung

Dieses Projekt enthält **keinen Werbecode**. Wenn du Werbung (z. B. Google AdSense) einbauen möchtest, füge das Skript selbst hinzu, beachte die Richtlinien des Anbieters und aktualisiere auch die Datenschutzerklärung.

## Datenschutz

- QR-Codes werden vollständig im Browser erzeugt und gelesen; es werden keine Daten an einen Server gesendet
- Nur `localStorage` wird verwendet, um Design- und Spracheinstellungen zu speichern
- Keine Werbung, keine Analyse, keine Tracking-Cookies

Details siehe [privacy.html](privacy.html).

## Mitwirken

Issues und Pull Requests sind willkommen. Vor dem Einreichen bitte sicherstellen:

- `npm run build` läuft fehlerfrei durch
- Änderungen funktionieren auf Desktop und Mobilgeräten
- Neue UI-Texte werden in allen 10 Sprachen ergänzt (fehlende Keys fallen auf Chinesisch / Englisch zurück)

## Lizenz

[MIT](LICENSE)

Lizenzen Dritter: [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)

- [jsQR](https://github.com/cozmo/jsQR) — Apache-2.0
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) — MIT
