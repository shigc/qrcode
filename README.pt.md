# Gerador de QR Code

[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · **Português** · [Русский](README.ru.md) · [العربية](README.ar.md)

Ferramenta online gratuita, multilíngue e 100% frontend para gerar e ler QR codes. Todo o processamento acontece no navegador: nenhum dado é enviado, sem anúncios e sem cookies de rastreamento.

- Demo online: https://qrcode.shigc.top/
- Tecnologias: HTML / CSS / JavaScript puro, sem framework e sem backend
- Hospedagem: qualquer hospedagem estática (Cloudflare Pages, GitHub Pages, Netlify, Vercel etc.)

## Recursos

- **Geração de QR code**: 8 tipos — texto / URL, WiFi, vCard, e-mail, SMS, telefone, localização, evento
- **Personalização de estilo**: cores de primeiro plano / fundo, estilo dos pontos, estilo dos cantos, logo com opacidade, nível de correção de erros
- **Exportação**: PNG (vários tamanhos) e SVG
- **Leitura de QR code**: envie uma imagem ou escaneie com a câmera
- **Multilíngue**: 10 idiomas (árabe com RTL automático)
- **Tema**: claro / escuro / sistema, preferência salva no `localStorage`
- **SEO / PWA**: HTML semântico, dados estruturados, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`

## Estrutura do projeto

```
.
├── index.html                 # Gerador de QR code
├── decode.html                # Leitor de QR code
├── about.html                 # Sobre / termos de uso
├── contact.html               # Página de contato
├── privacy.html               # Política de privacidade
├── favicon.svg
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
├── build.mjs                  # Build: copiar arquivos + ofuscar o JS principal -> dist/
├── package.json
├── assets/
│   ├── css/main.css           # Todos os estilos
│   ├── js/
│   │   ├── i18n.js            # Textos da interface em 10 idiomas
│   │   ├── theme.js           # Troca de tema
│   │   ├── qr-generator.js    # Lógica de geração de QR
│   │   ├── qr-decoder.js      # Lógica de leitura de QR
│   │   └── main.js            # Entrada comum (navegação, rodapé, inicialização)
│   └── lib/
│       ├── qr-code-styling.js # Biblioteca de renderização de QR
│       └── jsQR.js            # Biblioteca de leitura de QR
└── dist/                      # Saída do build (no .gitignore)
```

## Desenvolvimento local

O código-fonte roda diretamente, sem build:

```bash
# use qualquer servidor estático
python -m http.server 8080
# ou
npm run dev
```

Depois abra http://localhost:8080/.

> É necessário acessar via servidor HTTP. Abrir `index.html` diretamente com `file://` quebra algumas funções.

## Build

```bash
npm install
npm run build
```

O script de build:

1. Apaga e recria `dist/`
2. Copia todos os arquivos estáticos para `dist/`
3. Ofusca o código principal de `assets/js/` com [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator)

`dist/` é o diretório de implantação. As bibliotecas em `assets/lib/` não são ofuscadas para não quebrar suas APIs.

## Implantação

### Cloudflare Pages

```bash
npm run deploy
# equivale a: npm run build && npx wrangler pages deploy dist
```

Na primeira vez, execute `npx wrangler login`, ou em CI forneça as credenciais pela variável de ambiente `CLOUDFLARE_API_TOKEN` (**nunca faça commit do token**).

### GitHub Pages

```bash
npm run build
# publique dist/ na branch gh-pages
```

Todos os recursos usam caminhos relativos, então o site também funciona em um subcaminho como `https://<user>.github.io/qrcode/`.

### Outras plataformas

Use o diretório `dist/` como raiz do site.

## Personalização

| O que alterar | Onde |
| --- | --- |
| Nome do site / texto do logo | `.logo` e `<title>` de cada HTML, `manifest.webmanifest` |
| E-mail de contato | `about.html`, `contact.html`, `privacy.html` e `assets/js/i18n.js` |
| Domínio do site | `robots.txt`, `sitemap.xml`, `homepage` em `package.json` |
| Traduções da interface | `assets/js/i18n.js` |
| Arquivos excluídos do build | o conjunto `EXCLUDE` em `build.mjs` |

### Anúncios

Este projeto **não contém código de anúncios**. Se quiser adicionar anúncios (por exemplo Google AdSense), adicione o script você mesmo, siga as políticas do provedor e atualize também a política de privacidade.

## Privacidade

- A geração e a leitura de QR codes acontecem inteiramente no navegador; nenhum dado é enviado a servidores
- Apenas o `localStorage` é usado para lembrar tema e idioma
- Sem anúncios, sem analytics e sem cookies de rastreamento

Veja [privacy.html](privacy.html) para mais detalhes.

## Contribuição

Issues e pull requests são bem-vindos. Antes de enviar, verifique se:

- `npm run build` termina sem erros
- As mudanças funcionam no desktop e no celular
- Novos textos da interface são adicionados nos 10 idiomas (chaves ausentes usam chinês / inglês)

## Licença

[MIT](LICENSE)

Licenças de terceiros: [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)

- [jsQR](https://github.com/cozmo/jsQR) — Apache-2.0
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) — MIT
