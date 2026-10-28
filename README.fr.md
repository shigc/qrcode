# Générateur de QR codes

[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · **Français** · [Deutsch](README.de.md) · [Português](README.pt.md) · [Русский](README.ru.md) · [العربية](README.ar.md)

Outil en ligne gratuit, multilingue et 100 % frontend pour générer et lire des QR codes. Tout le traitement se fait dans votre navigateur : aucune donnée n'est envoyée, pas de publicité, pas de cookies de suivi.

- Démo en ligne : https://qrcode.shigc.top/
- Technologies : HTML / CSS / JavaScript natif, sans framework ni backend
- Hébergement : tout hébergement statique (Cloudflare Pages, GitHub Pages, Netlify, Vercel, etc.)

## Fonctionnalités

- **Génération de QR codes** : 8 types — texte / URL, WiFi, vCard, e-mail, SMS, téléphone, position, événement
- **Personnalisation du style** : couleurs de premier plan / fond, forme des points, forme des coins, logo avec opacité, niveau de correction d'erreur
- **Export** : PNG (plusieurs tailles) et SVG
- **Lecture de QR codes** : importez une image ou scannez avec la caméra
- **Multilingue** : 10 langues (arabe avec RTL automatique)
- **Thème** : clair / sombre / système, préférence stockée dans `localStorage`
- **SEO / PWA** : HTML sémantique, données structurées, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`

## Structure du projet

```
.
├── index.html                 # Générateur de QR codes
├── decode.html                # Lecteur de QR codes
├── about.html                 # À propos / conditions d'utilisation
├── contact.html               # Page de contact
├── privacy.html               # Politique de confidentialité
├── favicon.svg
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
├── build.mjs                  # Build : copie des fichiers + obfuscation du JS principal -> dist/
├── package.json
├── assets/
│   ├── css/main.css           # Tous les styles
│   ├── js/
│   │   ├── i18n.js            # Textes de l'interface en 10 langues
│   │   ├── theme.js           # Changement de thème
│   │   ├── qr-generator.js    # Logique de génération de QR
│   │   ├── qr-decoder.js      # Logique de lecture de QR
│   │   └── main.js            # Entrée commune (nav, pied de page, initialisation)
│   └── lib/
│       ├── qr-code-styling.js # Bibliothèque de rendu de QR
│       └── jsQR.js            # Bibliothèque de lecture de QR
└── dist/                      # Sortie du build (dans .gitignore)
```

## Développement local

Le code source fonctionne directement, sans build :

```bash
# utilisez n'importe quel serveur statique
python -m http.server 8080
# ou
npm run dev
```

Ouvrez ensuite http://localhost:8080/.

> Vous devez passer par un serveur HTTP. Ouvrir `index.html` directement en `file://` casse certaines fonctionnalités.

## Build

```bash
npm install
npm run build
```

Le script de build :

1. Vide et recrée `dist/`
2. Copie tous les fichiers statiques dans `dist/`
3. Obfusque le code métier principal de `assets/js/` avec [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator)

`dist/` est le répertoire à déployer. Les bibliothèques de `assets/lib/` ne sont pas obfusquées afin de préserver leurs API.

## Déploiement

### Cloudflare Pages

```bash
npm run deploy
# équivalent à : npm run build && npx wrangler pages deploy dist
```

Lors de la première utilisation, lancez `npx wrangler login`, ou en CI fournissez les identifiants via la variable d'environnement `CLOUDFLARE_API_TOKEN` (**ne committez jamais le token**).

### GitHub Pages

```bash
npm run build
# publiez dist/ sur la branche gh-pages
```

Toutes les ressources utilisent des chemins relatifs : le site fonctionne donc aussi dans un sous-chemin comme `https://<user>.github.io/qrcode/`.

### Autres plateformes

Utilisez le répertoire `dist/` comme racine du site.

## Personnalisation

| À modifier | Où |
| --- | --- |
| Nom du site / texte du logo | `.logo` et `<title>` de chaque HTML, `manifest.webmanifest` |
| E-mail de contact | `about.html`, `contact.html`, `privacy.html` et `assets/js/i18n.js` |
| Domaine du site | `robots.txt`, `sitemap.xml`, `homepage` dans `package.json` |
| Traductions de l'interface | `assets/js/i18n.js` |
| Fichiers exclus du build | l'ensemble `EXCLUDE` dans `build.mjs` |

### Publicité

Ce projet **ne contient aucun code publicitaire**. Si vous souhaitez ajouter des annonces (par exemple Google AdSense), ajoutez vous-même le script, respectez les règles du fournisseur et mettez également à jour la politique de confidentialité.

## Confidentialité

- La génération et la lecture des QR codes se font entièrement dans votre navigateur ; aucune donnée n'est envoyée à un serveur
- Seul `localStorage` est utilisé pour mémoriser le thème et la langue
- Aucune publicité, aucun outil d'analyse, aucun cookie de suivi

Voir [privacy.html](privacy.html) pour plus de détails.

## Contribuer

Les issues et pull requests sont les bienvenues. Avant de soumettre, vérifiez que :

- `npm run build` se termine correctement
- Les changements fonctionnent sur ordinateur et sur mobile
- Les nouveaux textes de l'interface sont ajoutés dans les 10 langues (les clés manquantes retombent sur le chinois / l'anglais)

## Licence

[MIT](LICENSE)

Licences tierces : [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)

- [jsQR](https://github.com/cozmo/jsQR) — Apache-2.0
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) — MIT
