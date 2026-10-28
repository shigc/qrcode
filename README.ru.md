# Генератор QR-кодов

[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt.md) · **Русский** · [العربية](README.ar.md)

Бесплатный многоязычный онлайн-инструмент для создания и чтения QR-кодов, работающий полностью в браузере. Вся обработка происходит локально: данные не отправляются на сервер, нет рекламы и отслеживающих cookie.

- Онлайн-демо: https://qrcode.shigc.top/
- Стек: чистые HTML / CSS / JavaScript, без фреймворков и бэкенда
- Хостинг: любой статический хостинг (Cloudflare Pages, GitHub Pages, Netlify, Vercel и др.)

## Возможности

- **Создание QR-кодов**: 8 типов — текст / URL, WiFi, vCard, email, SMS, телефон, местоположение, событие
- **Настройка стиля**: цвета переднего / заднего плана, форма точек, форма углов, логотип с прозрачностью, уровень коррекции ошибок
- **Экспорт**: PNG (несколько размеров) и SVG
- **Чтение QR-кодов**: загрузка изображения или сканирование камерой
- **Многоязычность**: 10 языков (арабский — автоматический RTL)
- **Тема**: светлая / тёмная / системная, сохраняется в `localStorage`
- **SEO / PWA**: семантический HTML, структурированные данные, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`

## Структура проекта

```
.
├── index.html                 # Генератор QR-кодов
├── decode.html                # Чтение QR-кодов
├── about.html                 # О проекте / условия использования
├── contact.html               # Контакты
├── privacy.html               # Политика конфиденциальности
├── favicon.svg
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
├── build.mjs                  # Сборка: копирование файлов + обфускация основного JS -> dist/
├── package.json
├── assets/
│   ├── css/main.css           # Все стили
│   ├── js/
│   │   ├── i18n.js            # Тексты интерфейса для 10 языков
│   │   ├── theme.js           # Переключение темы
│   │   ├── qr-generator.js    # Логика создания QR
│   │   ├── qr-decoder.js      # Логика чтения QR
│   │   └── main.js            # Общая точка входа (навигация, футер, инициализация)
│   └── lib/
│       ├── qr-code-styling.js # Библиотека отрисовки QR
│       └── jsQR.js            # Библиотека чтения QR
└── dist/                      # Результат сборки (в .gitignore)
```

## Локальная разработка

Исходники запускаются напрямую, без сборки:

```bash
# подойдёт любой статический сервер
python -m http.server 8080
# или
npm run dev
```

Затем откройте http://localhost:8080/.

> Нужно обращаться через HTTP-сервер. Открытие `index.html` напрямую через `file://` ломает часть функций.

## Сборка

```bash
npm install
npm run build
```

Скрипт сборки:

1. Удаляет и заново создаёт `dist/`
2. Копирует все статические файлы в `dist/`
3. Обфусцирует основной код в `assets/js/` с помощью [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator)

`dist/` — каталог для развёртывания. Библиотеки в `assets/lib/` не обфусцируются, чтобы не нарушать их API.

## Развёртывание

### Cloudflare Pages

```bash
npm run deploy
# эквивалентно: npm run build && npx wrangler pages deploy dist
```

При первом запуске выполните `npx wrangler login` либо в CI передайте учётные данные через переменную окружения `CLOUDFLARE_API_TOKEN` (**никогда не коммитьте токен**).

### GitHub Pages

```bash
npm run build
# опубликуйте dist/ в ветку gh-pages
```

Все ресурсы используют относительные пути, поэтому сайт работает и по вложенному пути вроде `https://<user>.github.io/qrcode/`.

### Другие платформы

Используйте каталог `dist/` как корень сайта.

## Настройка

| Что изменить | Где |
| --- | --- |
| Название сайта / текст логотипа | `.logo` и `<title>` в каждом HTML, `manifest.webmanifest` |
| Контактный email | `about.html`, `contact.html`, `privacy.html` и `assets/js/i18n.js` |
| Домен сайта | `robots.txt`, `sitemap.xml`, `homepage` в `package.json` |
| Переводы интерфейса | `assets/js/i18n.js` |
| Файлы, исключаемые из сборки | набор `EXCLUDE` в `build.mjs` |

### Реклама

В проекте **нет рекламного кода**. Если вы хотите добавить рекламу (например, Google AdSense), добавьте скрипт самостоятельно, соблюдайте правила платформы и обновите политику конфиденциальности.

## Конфиденциальность

- Создание и чтение QR-кодов полностью происходят в браузере; данные не отправляются на сервер
- Только `localStorage` используется для хранения темы и языка
- Нет рекламы, аналитики и отслеживающих cookie

Подробнее — в [privacy.html](privacy.html).

## Участие

Issues и pull requests приветствуются. Перед отправкой убедитесь, что:

- `npm run build` завершается без ошибок
- Изменения работают на десктопе и мобильных устройствах
- Новые тексты интерфейса добавлены во все 10 языков (отсутствующие ключи берутся из китайского / английского)

## Лицензия

[MIT](LICENSE)

Лицензии третьих сторон: [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)

- [jsQR](https://github.com/cozmo/jsQR) — Apache-2.0
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) — MIT
