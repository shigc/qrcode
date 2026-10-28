# Generador de códigos QR

[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · **Español** · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt.md) · [Русский](README.ru.md) · [العربية](README.ar.md)

Herramienta online gratuita, multilingüe y 100 % frontend para generar y leer códigos QR. Todo el procesamiento ocurre en tu navegador: no se suben datos, no hay anuncios ni cookies de seguimiento.

- Demo online: https://qrcode.shigc.top/
- Tecnologías: HTML / CSS / JavaScript puro, sin framework y sin backend
- Alojamiento: cualquier hosting estático (Cloudflare Pages, GitHub Pages, Netlify, Vercel, etc.)

## Características

- **Generación de códigos QR**: 8 tipos — texto / URL, WiFi, vCard, correo, SMS, teléfono, ubicación, evento
- **Personalización de estilo**: colores de primer plano / fondo, estilo de puntos, estilo de esquinas, logo con opacidad, nivel de corrección de errores
- **Exportación**: PNG (varios tamaños) y SVG
- **Lectura de códigos QR**: sube una imagen o escanea con la cámara
- **Multiidioma**: 10 idiomas (árabe con RTL automático)
- **Tema**: claro / oscuro / sistema, preferencia guardada en `localStorage`
- **SEO / PWA**: HTML semántico, datos estructurados, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`

## Estructura del proyecto

```
.
├── index.html                 # Generador de códigos QR
├── decode.html                # Lector de códigos QR
├── about.html                 # Acerca de / términos del servicio
├── contact.html               # Página de contacto
├── privacy.html               # Política de privacidad
├── favicon.svg
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
├── build.mjs                  # Build: copiar archivos + ofuscar el JS principal -> dist/
├── package.json
├── assets/
│   ├── css/main.css           # Todos los estilos
│   ├── js/
│   │   ├── i18n.js            # Textos de la interfaz en 10 idiomas
│   │   ├── theme.js           # Cambio de tema
│   │   ├── qr-generator.js    # Lógica de generación de QR
│   │   ├── qr-decoder.js      # Lógica de lectura de QR
│   │   └── main.js            # Entrada común (navegación, pie, inicialización)
│   └── lib/
│       ├── qr-code-styling.js # Librería de renderizado de QR
│       └── jsQR.js            # Librería de lectura de QR
└── dist/                      # Salida del build (en .gitignore)
```

## Desarrollo local

El código fuente funciona directamente sin compilar:

```bash
# usa cualquier servidor estático
python -m http.server 8080
# o
npm run dev
```

Luego abre http://localhost:8080/.

> Debes acceder mediante un servidor HTTP. Abrir `index.html` directamente con `file://` romperá algunas funciones.

## Compilación

```bash
npm install
npm run build
```

El script de build:

1. Borra y recrea `dist/`
2. Copia todos los archivos estáticos a `dist/`
3. Ofusca el código principal de `assets/js/` con [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator)

`dist/` es el directorio que se despliega. Las librerías de `assets/lib/` no se ofuscan para no romper sus APIs.

## Despliegue

### Cloudflare Pages

```bash
npm run deploy
# equivale a: npm run build && npx wrangler pages deploy dist
```

La primera vez ejecuta `npx wrangler login`, o en CI proporciona las credenciales mediante la variable de entorno `CLOUDFLARE_API_TOKEN` (**nunca subas el token al repositorio**).

### GitHub Pages

```bash
npm run build
# publica dist/ en la rama gh-pages
```

Todos los recursos usan rutas relativas, por lo que el sitio también funciona en una subruta como `https://<user>.github.io/qrcode/`.

### Otras plataformas

Usa el directorio `dist/` como raíz del sitio.

## Personalización

| Qué cambiar | Dónde |
| --- | --- |
| Nombre del sitio / texto del logo | `.logo` y `<title>` de cada HTML, `manifest.webmanifest` |
| Correo de contacto | `about.html`, `contact.html`, `privacy.html` y `assets/js/i18n.js` |
| Dominio del sitio | `robots.txt`, `sitemap.xml`, `homepage` en `package.json` |
| Traducciones de la interfaz | `assets/js/i18n.js` |
| Archivos excluidos del build | el conjunto `EXCLUDE` en `build.mjs` |

### Anuncios

Este proyecto **no contiene código publicitario**. Si quieres añadir anuncios (por ejemplo Google AdSense), agrega tú mismo el script, cumple las políticas del proveedor y actualiza también la política de privacidad.

## Privacidad

- La generación y lectura de códigos QR ocurren por completo en tu navegador; no se envían datos a ningún servidor
- Solo se usa `localStorage` para recordar el tema y el idioma
- Sin anuncios, sin analítica y sin cookies de seguimiento

Consulta [privacy.html](privacy.html) para más detalles.

## Contribuir

Las issues y pull requests son bienvenidas. Antes de enviar, asegúrate de que:

- `npm run build` termina correctamente
- Los cambios funcionan tanto en escritorio como en móvil
- Los nuevos textos de la interfaz se añaden a los 10 idiomas (si faltan, se usa chino / inglés)

## Licencia

[MIT](LICENSE)

Licencias de terceros: [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)

- [jsQR](https://github.com/cozmo/jsQR) — Apache-2.0
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) — MIT
